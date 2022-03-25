import * as commander from 'commander';

import { ArweaveApi } from '@builderdao/apis';
import { log as _log } from '../utils';

export function makeArweaveCommand() {
  const arweave = new commander.Command('arweave')
    .addHelpCommand(false)
    .description('Store Kafé tutorial content on Arweave')
    .configureHelp({
      helpWidth: 80,
      sortSubcommands: true,
      sortOptions: true,
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const log = (object: any) => _log(object, arweave.optsWithGlobals().key);

  arweave
    .command('store')
    .description('Store tutorial to Arweave')
    .argument('<content>', 'Content of tutorial')
    .addOption(
      new commander.Option('--address <address>', 'Author of the content')
        .env('ADDRESS')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--wallet <wallet>', 'Arweave wallet')
        .env('ARWEAVE_WALLET')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--appName <appName>', 'Arweave App Name')
        .env('ARWEAVE_APP_NAME')
        .makeOptionMandatory(),
    )
    .action(
      async (
        content: string,
        options: {
          address: string;
          wallet: string;
          appName: string;
        },
      ) => {
        const client = new ArweaveApi({
          appName: options.appName,
        });
        const txId = await client.publishTutorial(
          content,
          options.address,
          options.wallet,
        );
        log({ txId });
      },
    );

  return arweave;
}
