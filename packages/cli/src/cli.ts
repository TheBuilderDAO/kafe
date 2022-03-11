#!/usr/bin/env node
import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import * as bs58 from 'bs58';
import { TutorialProgramConfig } from '@builderdao-sdk/dao-program';

import { makeProposalCommand } from './commands/proposal';
import { makeReviewerCommand } from './commands/reviewer';
import { createKeypairFromSecretKey } from './utils';
import { makeArweaveCommand } from './commands/arweave';
import { makeCeramicCommand } from './commands/ceramic';
import { makeAlgoliaCommand } from './commands/algolia';
import { makeTutorialCommand } from './commands/tutorial';

const program = new commander.Command();
program
  .name('builderdao')
  .description(
    `
██████╗ ██╗   ██╗██╗██╗     ██████╗ ███████╗██████╗ ██████╗  █████╗  ██████╗ 
██╔══██╗██║   ██║██║██║     ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔═══██╗
██████╔╝██║   ██║██║██║     ██║  ██║█████╗  ██████╔╝██║  ██║███████║██║   ██║
██╔══██╗██║   ██║██║██║     ██║  ██║██╔══╝  ██╔══██╗██║  ██║██╔══██║██║   ██║
██████╔╝╚██████╔╝██║███████╗██████╔╝███████╗██║  ██║██████╔╝██║  ██║╚██████╔╝
╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝ 
                                                                               
CLI to interact with BuilderDAO programs.
    `,
  )
  .version('0.0.1');

program.option('-k --key <key>', 'get key from the result');
program.addOption(
  new commander.Option('--kafePk <kafePk>', 'Kafe Token PublicKey').default(
    new anchor.web3.PublicKey(
      'KAFE5ivWfDPP3dek2m36xvdU2NearVsnU5ryfCSAdAW',
    ).toString(),
  ),
);
program.addOption(
  new commander.Option('--payer <payer>', 'Keypair to sign trasactions')
    .default(bs58.encode(new anchor.web3.Keypair().secretKey))
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
program.parseAsync(process.argv);
