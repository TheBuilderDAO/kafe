/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import ora from 'ora';

import { getClient } from '../../client';
import { createKeypairFromSecretKey } from '../../utils';

const helpText = `
Remove an reviewer Solana pubkey to the Kafe program

Example call:
$ builderdao admin removeReviewer --adminKp <bs58Secret> --reviewerPk <bs58Pubkey> --ghHandle <string>
`;

export const AdminRemoveReviewer = () => {
  const removeReviewer = new commander.Command('removeReviewer')
    .description('Remove a reviewer to Kafe program')
    .addHelpText('after', helpText);

  removeReviewer
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
        '--reviewerPk <reviewerPk>',
        'address of the new reviewer',
      )
        .argParser(val => new anchor.web3.PublicKey(val))
        .makeOptionMandatory(),
    )
    .action(async options => {
      const client = getClient({
        network: removeReviewer.optsWithGlobals().network,
        payer: options.adminKp,
      });

      const spinner = ora('Processing transaction');
      spinner.start();

      const signature = await client.deleteReviewer({
        reviewerPk: options.reviewerPk,
        authorityPk: options.adminKp.publicKey.toString(),
      });

      spinner.succeed(`signature: ${signature}`);
      spinner.stop();
    });

  return removeReviewer;
};
