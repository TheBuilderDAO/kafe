#!/usr/bin/env node
/* eslint-disable import/first */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local')});

import chalk from 'chalk';
import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import { TutorialProgramConfig } from '@builderdao-sdk/dao-program';
import { version } from '../package.json';

import { makeProposalCommand } from './commands/proposal';
import { makeReviewerCommand } from './commands/reviewer';
import { createKeypairFromSecretKey, encodeKeypairSecretKey } from './utils';
import { makeArweaveCommand } from './commands/arweave';
import { makeCeramicCommand } from './commands/ceramic';
import { makeAlgoliaCommand } from './commands/algolia';
import { makeTutorialCommand } from './commands/tutorial';

const program = new commander.Command();
program
  .name('builderdao')
  // .description(chalk.green('builderdao'))
  .description(
    chalk.yellow(
      `
  ██████╗ ██╗   ██╗██╗██╗     ██████╗ ███████╗██████╗    ██████╗  █████╗  ██████╗
  ██╔══██╗██║   ██║██║██║     ██╔══██╗██╔════╝██╔══██╗   ██╔══██╗██╔══██╗██╔═══██╗
  ██████╔╝██║   ██║██║██║     ██║  ██║█████╗  ██████╔╝   ██║  ██║███████║██║   ██║
  ██╔══██╗██║   ██║██║██║     ██║  ██║██╔══╝  ██╔══██╗   ██║  ██║██╔══██║██║   ██║
  ██████╔╝╚██████╔╝██║███████╗██████╔╝███████╗██║  ██║   ██████╔╝██║  ██║╚██████╔╝
  ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝
      `,
    ) +
      chalk.white(
        `
  CLI to interact with Builder DAO programs.
        `,
      ),
  )
  .version(
    `Builder DAO CLI v${version}`,
    '-v --version',
    'Outputs version number',
  )
  .helpOption('-h, --help', 'Display help for command')
  .addHelpCommand(false)
  .configureHelp({
    helpWidth: 80,
    sortSubcommands: true,
    sortOptions: true,
  });

program.option('-k, --key <key>', 'Get key from the result');
program.addOption(
  new commander.Option('--kafePk <kafePk>', 'Kafe Token PublicKey').default(
    new anchor.web3.PublicKey(
      'KAFE5ivWfDPP3dek2m36xvdU2NearVsnU5ryfCSAdAW',
    ).toString(),
  ),
);
program.addOption(
  new commander.Option(
    '--payer <payer>',
    'Base58-encoded private key to sign trasactions',
  )
    .default(encodeKeypairSecretKey(new anchor.web3.Keypair()))
    .argParser((val: string) => createKeypairFromSecretKey(val)),
);
program.addOption(
  new commander.Option('--network <network>', 'Solana Network')
    .default(TutorialProgramConfig.Network.TESTNET)
    .choices(Object.values(TutorialProgramConfig.Network)),
);
program.addCommand(makeProposalCommand());
program.addCommand(makeReviewerCommand());
program.addCommand(makeArweaveCommand());
program.addCommand(makeCeramicCommand());
program.addCommand(makeAlgoliaCommand());
program.addCommand(makeTutorialCommand());
program.showSuggestionAfterError();
program.showHelpAfterError('💡 Use `builderdao` to see all available commands');
program.parseAsync(process.argv);
