import * as commander from 'commander';

import { AlgoliaApi } from '@builderdao/apis';

export function makeAlgoliaCommand() {
  const algolia = new commander.Command('algolia').description('Algolia');

  algolia
    .command('updateIndex')
    .description('Update index when tutorial is published')
    .argument('<objectId>', 'Object ID')
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
          data: any,
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

        await client.updateTutorial(
          objectId,
          {
            ...options.data,
            lastUpdatedAt: Date.now(),
          }
        );
      },
    );

  return algolia;
}
