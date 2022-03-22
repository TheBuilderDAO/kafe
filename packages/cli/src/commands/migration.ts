/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import * as commander from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import * as csv from 'fast-csv';
import { CeramicApi } from '@builderdao/apis';
import {
  ProposalStateE,
  filterAccountByReadyToPublishState,
} from '@builderdao-sdk/dao-program';

import inputData from '../../data/dump.json';
import inputSlug from '../../data/slug.json';
import { getClient } from '../client';
import { createKeypairFromSecretKey } from '../utils';

const TAG_DELIMITER = ';';
const CSV_PATH = ['data', 'dump.csv'];

interface CsvEntry {
  slug: string;
  protocol: string;
  title: string;
  description: string;
  markdown_url: string;
  author: string;
  author_url: string;
  tags: string;
  difficulty_level: string;
}

/*
interface Entry  {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
};
*/

interface Entry {
  blob: string;
}

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const parseCsvProtocol = (value: string) => {
  switch (value) {
    case 'thegraph':
      return 'The Graph';
    default:
      return capitalizeFirstLetter(value);
  }
};

export const parseTags = (value: string) => {
  switch (value) {
    case 'Graphql':
      return 'GraphQL';
    case 'Smart Contracts':
      return 'Smart Contract';
    default:
      return capitalizeFirstLetter(value);
  }
};

const parseCsvDifficulty = (value: string) => {
  switch (value) {
    case 'Beginner':
      return 'Beginner';
    case 'Intermediate':
      return 'Beginner';
    case 'Advanced':
      return 'Experienced';
    default:
      return 'Beginner';
  }
};

const isEmptyString = (str: string) => {
  switch (str) {
    case '':
      return true;
    case '""':
      return true;
    default:
      return false;
  }
};

export const parseCsvTags = (tags: string) => {
  if (isEmptyString(tags)) {
    return [];
  }
  return tags.split(TAG_DELIMITER).map(parseTags);
};

export const mandatoryOrFail = (value: string, field: string) => {
  if (isEmptyString(value)) {
    throw new Error(`Invalid ${field}`);
  }
  return value;
};

export function makeMigrationCommand() {
  const migration = new commander.Command('migration').description(
    'Solana account migration',
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let client = getClient({
    kafePk: migration.optsWithGlobals().kafePk,
    network: migration.optsWithGlobals().network,
    payer: migration.optsWithGlobals().payer,
  });

  migration
    .command('run')
    .option('--slug', 'slug of the proposal')
    .action(async options => {
      fs.createReadStream(path.join(...CSV_PATH))
        .pipe(csv.parse({ headers: true }))
        .pipe(csv.format<CsvEntry, Entry>({ headers: true }))
        .transform((row, next): void => {
          const {
            slug,
            title,
            description,
            protocol: protocol0,
            tags: tags0,
            difficulty_level: difficulty0,
          } = row;
          mandatoryOrFail(title, 'title');
          mandatoryOrFail(slug, 'slug');
          mandatoryOrFail(description, 'description');
          mandatoryOrFail(protocol0, 'protocol');
          const protocol = parseCsvProtocol(protocol0);
          const tags = parseCsvTags(tags0);
          const difficulty = parseCsvDifficulty(difficulty0);
          const data = {
            slug,
            title,
            description,
            tags: [protocol, ...tags],
            difficulty,
          };
          if (options.slug) {
            console.log(JSON.stringify(data, null, 2));
            console.log(',');
          } else {
            console.log(JSON.stringify(data.slug, null, 2));
            console.log(',');
          }
          return next(null);
        })
        .pipe(process.stdout)
        .on('end', () => process.exit());
    });

  migration
    .command('load')
    .addOption(
      new commander.Option('--ceramicUrl <ceramicUrl>', 'Ceramic Node Url')
        .env('CERAMIC_NODE_URL')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--ceramicSeed <ceramicSeed>', 'Ceramic Seed')
        .env('CERAMIC_SEED')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '-a, --adminKp <adminKp>',
        'Admin KeyPair (bs58 encoded)',
      )
        .argParser(val => createKeypairFromSecretKey(val))
        .env('ADMIN_KP')
        .makeOptionMandatory(),
    )
    .action(async options => {
      client = getClient({
        kafePk: migration.optsWithGlobals().kafePk,
        network: migration.optsWithGlobals().network,
        payer: options.adminKp,
      });
      const daoAccount = await client.getDaoAccount();
      let id = daoAccount.numberOfTutorial.toNumber();
      let streamId;
      let stream;

      const ceramicApi = new CeramicApi({
        nodeUrl: options.ceramicUrl,
      });
      ceramicApi.setSeed(options.ceramicSeed);

      for (const data of Array.from(inputData)) {
        try {
          // @ts-ignore
          stream = await ceramicApi.storeMetadata({
            title: data.title,
            slug: data.slug,
            description: data.description,
            difficulty: data.difficulty,
            tags: data.tags,
          });
          streamId = stream.id.toString();

          await client.createTutorial({
            id,
            slug: data.slug,
            userPk: options.adminKp.publicKey,
            streamId,
          });

          await client.assignReviewer({
            id,
            reviewerPks: [options.adminKp.publicKey, options.adminKp.publicKey],
            authorityPk: options.adminKp.publicKey,
          });

          await client.proposalSetState({
            id,
            adminPk: options.adminKp.publicKey,
            newState: ProposalStateE.readyToPublish,
          });
          const output = {
            id,
            slug: data.slug,
            streamId,
            title: data.title,
            description: data.description,
            difficulty: data.difficulty,
            tags: data.tags,
          };
          console.log(JSON.stringify(output, null, 2));
          console.log(',');

          id += 1;
        } catch (error) {
          console.error(JSON.stringify(data, null, 2));
        }
      }
    });

  migration
    .command('list')
    .option('--id', 'sort by id of the proposal')
    .action(async options => {
      const parseProposalData = (data: any) => ({
        id: data.account.id.toNumber(),
        slug: data.account.slug,
      });
      const compareBySlug = (a: any, b: any) => {
        if (a.slug < b.slug) {
          return -1;
        }
        if (a.slug > b.slug) {
          return 1;
        }
        return 0;
      };
      const compareById = (a: any, b: any) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      };

      const rawProposals = await client.getProposals([
        filterAccountByReadyToPublishState,
      ]);
      if (options.id) {
        console.log(
          JSON.stringify(
            rawProposals.map(parseProposalData).sort(compareById),
            null,
            2,
          ),
        );
      } else {
        console.log(
          JSON.stringify(
            rawProposals.map(parseProposalData).sort(compareBySlug),
            null,
            2,
          ),
        );
      }
      // Checking stuff
      // const refSlug = Array.from(inputData).map(data => data.slug)
      // const curSlug = rawProposals.map(data => data.account.slug)
      // const diff = refSlug.filter(x => !curSlug.includes(x) );
      // console.log(diff)
      // console.log(rawProposals.length)
    });

  migration
    .command('close')
    .addOption(
      new commander.Option(
        '--id <id>',
        'id of the proposal to close',
      ).makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--admin <admin>', 'Admin KeyPair (bs58 encoded)')
        .argParser(val => createKeypairFromSecretKey(val))
        .makeOptionMandatory(),
    )
    .action(async options => {
      client = getClient({
        kafePk: migration.optsWithGlobals().kafePk,
        network: migration.optsWithGlobals().network,
        payer: options.admin,
      });
      console.log(options.admin.publicKey.toString());
      const signature = await client.closeTutorial({
        id: options.id,
        userPk: options.admin.publicKey,
      });
      console.log(signature);
    });

  migration.command('display').action(async () => {
    const compareById = (a: any, b: any) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    };
    const records = [];
    const slugs = Array.from(inputSlug);
    const tutorials = Array.from(inputData);
    const proposals = (
      await client.getProposals([filterAccountByReadyToPublishState])
    ).map((dt: any) => ({
      id: dt.account.id.toNumber(),
      slug: dt.account.slug,
      streamId: dt.account.streamId,
      creator: dt.account.creator.toString(),
      reviewer1: dt.account.reviewer1.toString(),
      reviewer2: dt.account.reviewer2.toString(),
      state: Object.keys(dt.account.state)[0],
      date: dt.account.createdAt.toNumber(),
    }));

    for (const slug of slugs) {
      const proposalHasSlug = proposals.map(x => x.slug).includes(slug);
      const tutorialHasSlug = tutorials.map(x => x.slug).includes(slug);
      if (proposalHasSlug && tutorialHasSlug) {
        records.push({
          ...tutorials.filter(x => x.slug === slug)[0],
          ...proposals.filter(x => x.slug === slug)[0],
        });
      } else {
        console.error(slug);
      }
    }
    console.log(JSON.stringify(records.sort(compareById), null, 2));
  });

  return migration;
}
// MEMO
// 5cdHARAmbM45GNCzPC1abW3P1P6up5Qeo2TzMMXmiZEFiVK53KsAQVQoRpgc4Y4cdVzsmJaBKqw8Gz5rSwWT9fBN
// CERAMIC_NODE_URL=https://ceramic-clay.3boxlabs.com builderdao  migration load --ceramicSeed '38 102 235 59 188 240 198 152 202 66 50 251 35 230 174 244 22 27 57 118 208 150
//  116 52 179 170 86 165 172 87 205 140' --adminKp 5cdHARAmbM45GNCzPC1abW3P1P6up5Qeo2TzMMXmiZEFiVK53KsAQVQoRpgc4Y4cdVzsmJaBKqw8Gz5rSwWT9fBN
// builderdao migration list --id
// builderdao migration close --id 102 --admin 5cdHARAmbM45GNCzPC1abW3P1P6up5Qeo2TzMMXmiZEFiVK53KsAQVQoRpgc4Y4cdVzsmJaBKqw8Gz5rSwWT9fBN
