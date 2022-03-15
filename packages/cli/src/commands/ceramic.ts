import * as commander from 'commander';

import { CeramicApi } from '@builderdao/apis';
import { log as _log } from '../utils';

export function makeCeramicCommand() {
  const ceramic = new commander.Command('ceramic').description('Ceramic');
  const log = (object: any) => _log(object, ceramic.optsWithGlobals().key);
  ceramic
    .command('updateMetadata')
    .description('Update tutorial metadata')
    .argument('<streamId>', 'Stream ID')
    .addOption(
      new commander.Option(
        '--publishedUri <publishedUri>',
        'URI of published tutorial',
      )
        .env('PUBLISHED_URI')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--nodeUrl <nodeUrl>', 'Ceramic Node Url')
        .env('CERAMIC_NODE_URL')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--seed <seed>', 'Ceramic Seed')
        .env('CERAMIC_SEED')
        .makeOptionMandatory(),
    )
    .action(
      async (
        streamId: string,
        options: {
          publishedUri: string;
          nodeUrl: string;
          seed: string;
        },
      ) => {
        const client = new CeramicApi({
          nodeUrl: options.nodeUrl,
        });

        client.setSeed(options.seed);

        const result = await client.updateMetadata(streamId, {
          publishedUri: options.publishedUri,
        });
        log(result);
      },
    );

  return ceramic;
}
