/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import ora from 'ora';

import { getClient } from '../../client';
import { createKeypairFromSecretKey } from '../../utils';

const helpText = `
Add an reviewer Solana pubkey to the Kafe program

Example call:
$ builderdao admin addReviewer --adminKp <bs58Secret> --reviewerPk <bs58Pubkey> --ghHandle <string>
`;

export const AdminAddReviewer = () => {
  const addReviewer = new commander.Command('addReviewer')
    .description('Add a reviewer to Kafe program')
    .addHelpText(
      'after',
      helpText
    )

    addReviewer
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
    .addOption(
      new commander.Option(
        '--ghHandle <ghHandle>',
        'github handle of the new reviewer',
      )
        .makeOptionMandatory(),
    )
    .action(
      async (options) => {
        const client = getClient({
          network: addReviewer.optsWithGlobals().network,
          payer: options.adminKp,
        });
  
        const spinner = ora('Processing transaction')
        spinner.start();

        const signature = await client.createReviewer({
          reviewerPk: options.reviewerPk,
          authorityPk: options.adminKp.publicKey.toString(),
          githubName: options.ghHandle,
        });

        spinner.succeed(`signature: ${signature}`);
        spinner.stop();
      },
    );

  return addReviewer;
}