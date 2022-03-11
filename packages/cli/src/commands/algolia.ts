import * as commander from 'commander';
import { ProposalStateE } from '@builderdao-sdk/dao-program';

import { AlgoliaApi } from '@builderdao/apis';
import { log as _log } from '../utils';

export function makeAlgoliaCommand() {
  const algolia = new commander.Command('algolia').description('Algolia');
  const log = (object: any) => _log(object, algolia.optsWithGlobals().key);

  algolia
    .command('updateIndex')
    .description('Update index when tutorial is published')
    .argument('<objectId>', 'Object ID')
    .addOption(
      new commander.Option('--content <content>', 'Tutorial content')
        .env('CONTENT')
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
        const txId = await client.publishTutorial(
          objectId,
          ProposalStateE.published,
        );
        log({ txId });
      },
    );

  return algolia;
}
