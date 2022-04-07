/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import ora from 'ora';

import { getClient } from '../../client';
import { createKeypairFromSecretKey } from '../../utils';

const helpText = `
Example call:
$ builderdao airdrop --adminKp <bs58Secret> --address <bs58Pubkey>
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
    .action(
      async (
        options: {
          address: anchor.web3.PublicKey;
          adminKp: anchor.web3.Keypair;
        },
      ) => {
        const client = getClient({
          network: airdrop.optsWithGlobals().network,
          payer: airdrop.optsWithGlobals().payer,
        });
        const spinner = ora('Processing Airdrop')
        spinner.start();

        const signature = await client.airdrop({
          memberPk: options.address,
          authority: options.adminKp,
        });

        spinner.succeed(`signature: ${signature}`);
        spinner.stop();
      },
    );

  return airdrop;
}