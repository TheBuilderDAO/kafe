/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import ora from 'ora';

import { getClient } from '../../client';
import { createKeypairFromSecretKey } from '../../utils';

const helpText = `
Aidrop info:
- 1 Kafe Token
- 100 BDR Token (frozen)

Example call to airdrop both Kafe and BDR token:
$ builderdao admin airdrop --adminKp <bs58Secret> --address <bs58Pubkey>

Example call to airdrop only BDR token:
$ builderdao admin airdrop --adminKp <bs58Secret> --address <bs58Pubkey> --onlyBDR

Example call to airdrop only Kafe token:
$ builderdao admin airdrop --adminKp <bs58Secret> --address <bs58Pubkey> --onlyKafe
`;

export const AdminAirdropCommand = () => {
  const airdrop = new commander.Command('airdrop')
    .description('Airdrop token to user')
    .addHelpText(
      'after',
      helpText
    )

  airdrop
    .addOption(
      new commander.Option(
        '--adminKp <adminKp>',
        'Admin KeyPair (bs58 encoded)',
      )
        .argParser(val => createKeypairFromSecretKey(val))
        .env('ADMIN_KP')
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option(
        '--address <address>',
        'address of the receiver',
      )
        .argParser(val => new anchor.web3.PublicKey(val))
        .makeOptionMandatory(),
    )
    .option('--onlyKafe', 'Airdrop only Kafe Token')
    .option('--onlyBDR', 'Airdrop only BDR Token')
    .action(
      async (options) => {
        const client = getClient({
          network: airdrop.optsWithGlobals().network,
          payer: options.adminKp,
        });

        const spinner = ora('Processing Airdrop')
        spinner.start();

        const isKafeDrop = !!options.onlyBDR
        const isBdrDrop = !!options.onlyKafe

        const signature = await client.airdrop({
          memberPk: options.address,
          authority: options.adminKp,
          isBdrDrop,
          isKafeDrop,
        });

        spinner.succeed(`signature: ${signature}`);
        spinner.stop();
      },
    );

  return airdrop;
}