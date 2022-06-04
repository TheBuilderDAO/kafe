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
    .argument('<slug>', 'Tutorial Slug')
    .addOption(
      new commander.Option('--content <content>', 'Content of tutorial')
        .env('CONTENT')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--address <address>', 'Author of the content')
        .env('ADDRESS')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--contentType <contentType>', 'Content type')
        .env('CONTENT_TYPE')
        .default('text/plain')
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
    .addOption(
      new commander.Option('--arweaveHost <arweaveHost>', 'Arweave Host')
        .env('ARWEAVE_HOST')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--arweavePort <arweavePort>', 'Arweave Port')
        .env('ARWEAVE_PORT')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--arweaveProtocol <arweaveProtocol>',
        'Arweave Protocol',
      )
        .env('ARWEAVE_PROTOCOL')
        .default('https'),
    )
    .action(
      async (options: {
        content: string;
        wallet: string;
        arweaveHost: string;
        arweavePort: string;
        arweaveProtocol: string;
        slug: string;
        address: string;
        appName: string;
        contentType: string;
      }) => {
        const client = new ArweaveApi({
          host: options.arweaveHost,
          port: parseInt(options.arweavePort, 10),
          protocol: options.arweaveProtocol,
        });
        const txId = await client.publishTutorial(
          options.content,
          options.wallet,
          {
            Slug: options.slug,
            'App-Name': options.appName,
            Address: options.address,
            'Content-Type': options.contentType,
          },
        );
        log({ txId });
      },
    );

  arweave
    .command('retrieve')
    .description('Retrieve tutorial from Arweave')
    .argument('<txId>', 'Arweave Transaction Id')
    .addOption(
      new commander.Option('--arweaveHost <arweaveHost>', 'Arweave Host')
        .env('ARWEAVE_HOST')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--arweavePort <arweavePort>', 'Arweave Port')
        .env('ARWEAVE_PORT')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--arweaveProtocol <arweaveProtocol>',
        'Arweave Protocol',
      )
        .env('ARWEAVE_PROTOCOL')
        .default('https'),
    )
    .action(
      async (
        txId: string,
        options: {
          arweaveHost: string;
          arweavePort: string;
          arweaveProtocol: string;
        },
      ) => {
        const client = new ArweaveApi({
          host: options.arweaveHost,
          port: parseInt(options.arweavePort, 10),
          protocol: options.arweaveProtocol,
        });
        const data = await client.getTutorialByHash(txId);
        log({ data });
      },
    );

  return arweave;
}
