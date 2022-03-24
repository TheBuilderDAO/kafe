#!/usr/bin/env node
import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import { TutorialProgramConfig } from '@builderdao-sdk/dao-program';

import { makeMigrationCommand } from './commands/solana';
import { createKeypairFromSecretKey } from './utils';

const program = new commander.Command();
program
  .name('migrationdao')
  .description(`CLI to manage solana migration related task.`)
  .version('0.0.1');

program.addOption(
  new commander.Option('--kafePk <kafePk>', 'Kafe Token PublicKey').default(
    new anchor.web3.PublicKey(
      'KAFE5ivWfDPP3dek2m36xvdU2NearVsnU5ryfCSAdAW',
    ).toString(),
  ),
);

program.addOption(
  new commander.Option(
    '--solanaAdminKey <solanaAdminKey>',
    'Solana Admin KeyPair (bs58 encoded)',
  )
    .argParser(val => createKeypairFromSecretKey(val))
    .env('SOLANA_ADMIN_KP')
    .makeOptionMandatory(),
);

program.addOption(
  new commander.Option('--network <network>', 'Solana Network')
    .default(TutorialProgramConfig.Network.TESTNET)
    .choices(Object.values(TutorialProgramConfig.Network)),
);

program.addCommand(makeMigrationCommand());

program.showSuggestionAfterError();

program.parseAsync(process.argv);
