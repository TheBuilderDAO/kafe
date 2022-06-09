/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import ora from 'ora';

import { getClient } from '../../client';
import { createKeypairFromSecretKey } from '../../utils';

const helpText = `
Remove an admin Solana pubkey to the Kafe Admin list

Example call:
$ builderdao admin removeAdmin --adminKp <bs58Secret> --address <bs58Pubkey>
`;

export const AdminRemoveAdmin = () => {
  const removeAdmin = new commander.Command('removeAdmin')
    .description('Remove Admin to Kafe List')
    .addHelpText('after', helpText);

  removeAdmin
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
      new commander.Option('--address <address>', 'address of the receiver')
        .argParser(val => new anchor.web3.PublicKey(val))
        .makeOptionMandatory(),
    )
    .action(async options => {
      const client = getClient({
        network: removeAdmin.optsWithGlobals().network,
        payer: options.adminKp,
      });

      const spinner = ora('Processing transaction');
      spinner.start();

      const signature = await client.daoRemoveAdmin({
        userPk: options.address,
        adminPk: options.adminKp.publicKey.toString(),
      });

      spinner.succeed(`signature: ${signature}`);
      spinner.stop();
    });

  return removeAdmin;
};
