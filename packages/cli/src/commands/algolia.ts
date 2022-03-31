/* eslint-disable no-console */
import * as commander from 'commander';
import path from 'path';

import { AlgoliaApi } from '@builderdao/apis';
import { ProposalStateE } from '@builderdao-sdk/dao-program';
import { BuilderDaoConfig } from '../services';

export function makeAlgoliaCommand() {
  const rootTutorialFolderPath = path.join(__dirname, '../../../', 'tutorials');

  const algolia = new commander.Command('algolia')
    .addHelpCommand(false)
    .description('Update the Algolia index for Kafé')
    .configureHelp({
      helpWidth: 80,
      sortSubcommands: true,
      sortOptions: true,
    });

  algolia.configureHelp({
    sortSubcommands: true,
    sortOptions: false,
  });

  algolia
    .command('provision')
    .description('Provisions Algolia app')
    .helpOption()
    .addOption(
      new commander.Option('--appId <appId>', 'Algolia App Id')
        .env('ALGOLIA_APP_ID')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--indexName <indexName>', 'Algolia Index Name')
        .env('ALGOLIA_INDEX_NAME')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--accessKey <accessKey>', 'Algolia Access Key')
        .env('ALGOLIA_ACCESS_KEY')
        .makeOptionMandatory(),
    )
    .action(
      async (
        options: {
          indexName: string;
          appId: string;
          accessKey: string;
        },
      ) => {
        const client = new AlgoliaApi({
          appId: options.appId,
          accessKey: options.accessKey,
          indexName: options.indexName,
        });

        try {
          await client.provision();
        } catch (err) {
          console.log('ERR:', err);
        }
      },
    );

  algolia
    .command('delete')
    .description('Deletes Algolia index')
    .helpOption()
    .addOption(
      new commander.Option('--appId <appId>', 'Algolia App Id')
        .env('ALGOLIA_APP_ID')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--indexName <indexName>', 'Algolia Index Name')
        .env('ALGOLIA_INDEX_NAME')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--accessKey <accessKey>', 'Algolia Access Key')
        .env('ALGOLIA_ACCESS_KEY')
        .makeOptionMandatory(),
    )
    .action(
      async (
        options: {
          indexName: string;
          appId: string;
          accessKey: string;
        },
      ) => {
        const client = new AlgoliaApi({
          appId: options.appId,
          accessKey: options.accessKey,
          indexName: options.indexName,
        });

        try {
          await client.delete();
        } catch (err) {
          console.log('Error: ', err);
        }
      },
    );

  algolia
    .command('updateIndex')
    .description('Update index with random data')
    .argument('<objectId>', 'Object ID')
    .helpOption()
    .addOption(
      new commander.Option('--data <data>', 'New data')
        .argParser(val => JSON.parse(val))
        .env('DATA')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--appId <appId>', 'Algolia App Id')
        .env('ALGOLIA_APP_ID')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--accessKey <accessKey>', 'Algolia Access Key')
        .env('ALGOLIA_ACCESS_KEY')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--indexName <indexName>', 'Algolia Index Name')
        .env('ALGOLIA_INDEX_NAME')
        .makeOptionMandatory(),
    )
    .action(
      async (
        objectId: string,
        options: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: any;
          appId: string;
          accessKey: string;
          indexName: string;
        },
      ) => {
        const client = new AlgoliaApi({
          appId: options.appId,
          accessKey: options.accessKey,
          indexName: options.indexName,
        });

        await client.updateTutorial(objectId, {
          ...options.data,
          lastUpdatedAt: Date.now(),
        });
      },
    );

  algolia
    .command('publish')
    .description('Update index when tutorial is published')
    .argument('[slug]', 'Tutorial slug')
    .helpOption('-h, --help', 'Display help for command')
    .addHelpCommand(false)
    .addOption(
      new commander.Option('--appId <appId>', 'Algolia App Id')
        .env('ALGOLIA_APP_ID')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--accessKey <accessKey>', 'Algolia Access Key')
        .env('ALGOLIA_ACCESS_KEY')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--indexName <indexName>', 'Algolia Index Name')
        .env('ALGOLIA_INDEX_NAME')
        .makeOptionMandatory(),
    )
    .action(
      async (
        slug: string,
        options: {
          appId: string;
          accessKey: string;
          indexName: string;
        },
      ) => {
        const client = new AlgoliaApi({
          appId: options.appId,
          accessKey: options.accessKey,
          indexName: options.indexName,
        });

        const rootFolder = slug
          ? path.join(rootTutorialFolderPath, slug)
          : process.cwd();
        const { lock, config } = new BuilderDaoConfig(rootFolder);
        await lock.read();
        await config.read();
        const proposalId = lock.chain.get('proposalId').value().toString();
        const title = config.chain.get('title').value().toString();
        const description = config.chain.get('description').value().toString();
        const categories = config.chain.get('categories').value();


        await client.updateTutorial(proposalId, {
          title,
          description,
          tags: categories,
          state: ProposalStateE.published,
          lastUpdatedAt: Date.now(),
        });
      },
    );

  return algolia;
}
