/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import ora from 'ora';

import { getClient } from '../../client';
import { createKeypairFromSecretKey } from '../../utils';

const helpText = `
Add an admin Solana pubkey to the Kafe Admin list

Example call:
$ builderdao admin addAdmin --adminKp <bs58Secret> --address <bs58Pubkey>
`;

export const AdminAddAdmin = () => {
  const addAdmin = new commander.Command('addAdmin')
    .description('Add Admin to Kafe List')
    .addHelpText('after', helpText);

  addAdmin
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
      new commander.Option('--address <address>', 'address of the new admin')
        .argParser(val => new anchor.web3.PublicKey(val))
        .makeOptionMandatory(),
    )
    .action(async options => {
      const client = getClient({
        network: addAdmin.optsWithGlobals().network,
        payer: options.adminKp,
      });

      const spinner = ora('Processing transaction');
      spinner.start();

      const signature = await client.daoAddAdmin({
        userPk: options.address,
        adminPk: options.adminKp.publicKey.toString(),
      });

      spinner.succeed(`signature: ${signature}`);
      spinner.stop();
    });

  return addAdmin;
};
