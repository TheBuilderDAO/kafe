/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import commander from 'commander';
import { CeramicApi, AlgoliaApi } from '@builderdao/apis';
import {
  ProposalStateE,
  filterAccountByState,
} from '@builderdao-sdk/dao-program';

import dump from '../../data/dump.json';
import { getClient } from '../client';
import { compareById, compareBySlug } from '../utils';

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
        accessKey: options.ALGOLIA_ADMIN_KEY,
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

      for (const tutorial of Array.from(dump)) {
        try {
          const id = await client.getNonce();
          // @ts-ignore
          const stream = await ceramicApi.storeMetadata({
            title: tutorial.title,
            slug: tutorial.slug,
            description: tutorial.description,
            difficulty: tutorial.difficulty,
            tags: tutorial.tags,
          });
          const streamId = stream.id.toString();

          await client.createTutorial({
            id,
            slug: tutorial.slug,
            userPk: walletPk,
            streamId,
          });

          await client.assignReviewer({
            id,
            reviewerPks: [walletPk, walletPk],
            authorityPk: walletPk,
          });

          await client.proposalSetState({
            id,
            adminPk: walletPk,
            newState: ProposalStateE.readyToPublish,
          });

          const record = {
            objectID: id.toString(),
            title: tutorial.title,
            slug: tutorial.slug,
            description: tutorial.description,
            author: walletPk,
            state: ProposalStateE.readyToPublish,
            tags: tutorial.tags,
            difficulty: tutorial.difficulty,
            numberOfVotes: 0,
          };

          await algoliaApi.createTutorial(record);
        } catch (error) {
          console.error(JSON.stringify(tutorial, null, 2));
        }
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
        filterAccountByState(ProposalStateE.readyToPublish),
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
        filterAccountByState(ProposalStateE.readyToPublish),
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
