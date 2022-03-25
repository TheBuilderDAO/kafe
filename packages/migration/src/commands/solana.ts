/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import commander from 'commander';
import { CeramicApi, AlgoliaApi } from '@builderdao/apis';
import {
  ProposalStateE,
  filterProposalByState,
} from '@builderdao-sdk/dao-program';
import { uniq } from 'lodash';

import dump from '../../data/dump.json';
import { getClient } from '../client';
import {
  compareById,
  compareBySlug,
  parseDifficulty,
  parseProtocol,
  parseSlug,
  parseTags,
} from '../utils';

export function makeMigrationCommand() {
  const solana = new commander.Command('solana').description(
    'Solana account migration',
  );

  solana
    .command('run')
    .addOption(
      new commander.Option('--algoliaAppId <algoliaAppId>', 'Algolia App Id')
        .env('ALGOLIA_APP_ID')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--algoliaAdmin <algoliaAdmin>',
        'Algolia Access Key',
      )
        .env('ALGOLIA_ADMIN_KEY')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--algoliaIndex <algoliaIndex>',
        'Algolia Index Name',
      )
        .env('ALGOLIA_INDEX_NAME')
        .makeOptionMandatory(),
    )
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
    .action(async options => {
      const algoliaApi = new AlgoliaApi({
        appId: options.algolioAppId,
        accessKey: options.algoliaAdmin,
        indexName: options.algolioIndex,
      });

      const client = getClient({
        kafePk: solana.optsWithGlobals().kafePk,
        network: solana.optsWithGlobals().network,
        payer: solana.optsWithGlobals().solanaAdminKey,
      });

      const walletPk = solana.optsWithGlobals().solanaAdminKey.publicKey;

      const ceramicApi = new CeramicApi({
        nodeUrl: options.ceramicUrl,
      });
      ceramicApi.setSeed(options.ceramicSeed);

      let record: any;
      const records: any = [];
      const description = 'Migrated tutorial from LEARN.V2 ';

      for (const tutorial of Array.from(dump).filter(dt => !dt.is_multi_page)) {
        try {
          const {
            slug: slug0,
            tags: tags0,
            title,
            difficulty: difficulty0,
          } = tutorial;

          const protocol = parseProtocol(tags0);
          const slug = parseSlug(slug0, protocol);
          const difficulty = parseDifficulty(difficulty0);
          const tags = [protocol, ...uniq(tags0.slice(1).map(parseTags))];
          const id = await client.getNonce();

          record = {
            objectID: id.toString(),
            title,
            slug,
            description,
            author: walletPk,
            state: ProposalStateE.readyToPublish,
            tags,
            difficulty,
            numberOfVotes: 0,
          };
          records.push(record);

          // @ts-ignore
          const stream = await ceramicApi.storeMetadata({
            title,
            slug,
            description,
            difficulty,
            tags,
          });
          const streamId = stream.id.toString();

          await client.createTutorial({
            id,
            slug,
            userPk: walletPk,
            streamId,
          });

          await client.assignReviewer({
            id,
            reviewerPks: [walletPk, walletPk],
            authorityPk: walletPk,
            force: true,
          });

          await client.proposalSetState({
            id,
            adminPk: walletPk,
            newState: ProposalStateE.readyToPublish,
          });
        } catch (error) {
          console.error(JSON.stringify(record, null, 2));
          process.exit(1);
        }
      }

      for (const data of records) {
        await algoliaApi.createTutorial(data);
      }
    });

  solana
    .command('list')
    .option('--id', 'sort by id of the proposal')
    .action(async options => {
      const client = getClient({
        kafePk: solana.optsWithGlobals().kafePk,
        network: solana.optsWithGlobals().network,
        payer: solana.optsWithGlobals().solanaAdminKey,
      });

      const parseProposalData = (data: any) => ({
        id: data.account.id.toNumber(),
        slug: data.account.slug,
      });

      const rawProposals = await client.getProposals([
        filterProposalByState(ProposalStateE.readyToPublish),
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
    });

  solana
    .command('close')
    .addOption(
      new commander.Option(
        '--id <id>',
        'id of the proposal to close',
      ).makeOptionMandatory(),
    )
    .action(async options => {
      const client = getClient({
        kafePk: solana.optsWithGlobals().kafePk,
        network: solana.optsWithGlobals().network,
        payer: solana.optsWithGlobals().solanaAdminKey,
      });

      const walletPk = solana.optsWithGlobals().solanaAdminKey.publicKey;

      const signature = await client.closeTutorial({
        id: options.id,
        userPk: walletPk,
      });
      console.log(signature);
    });

  solana.command('closeAll').action(async () => {
    const client = getClient({
      kafePk: solana.optsWithGlobals().kafePk,
      network: solana.optsWithGlobals().network,
      payer: solana.optsWithGlobals().solanaAdminKey,
    });

    const walletPk = solana.optsWithGlobals().solanaAdminKey.publicKey;

    const proposalIds = (
      await client.getProposals([
        filterProposalByState(ProposalStateE.readyToPublish),
      ])
    ).map(data => data.account.id.toNumber());

    for (const id of proposalIds) {
      try {
        const signature = await client.closeTutorial({
          id,
          userPk: walletPk,
        });
        console.log({
          id,
          signature,
        });
      } catch (error) {
        console.error(`error: ${id}`);
      }
    }
  });

  solana
    .command('debugEnv')
    .addOption(
      new commander.Option('--algoliaAppId <algoliaAppId>', 'Algolia App Id')
        .env('ALGOLIA_APP_ID')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--algoliaAdmin <algoliaAdmin>',
        'Algolia Access Key',
      )
        .env('ALGOLIA_ADMIN_KEY')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--algoliaIndex <algoliaIndex>',
        'Algolia Index Name',
      )
        .env('ALGOLIA_INDEX_NAME')
        .makeOptionMandatory(),
    )
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
    .action(async options => {
      console.log({
        solanaMint: solana.optsWithGlobals().kafePk,
        solanaNetwork: solana.optsWithGlobals().network,
        solanaAdminKey: solana.optsWithGlobals().solanaAdminKey,
        ceramicUrl: options.ceramicUrl,
        ceramicSeed: options.ceramicSeed,
        algolioAppId: options.algoliaAppId,
        algoliaAdmin: options.algoliaAdmin,
        algolioIndex: options.algoliaIndex,
      });
    });

  return solana;
}
