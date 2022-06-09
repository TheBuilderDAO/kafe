/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as commander from 'commander';
import * as anchor from '@project-serum/anchor';
import ora from 'ora';

import { getClient } from '../../client';
import { createKeypairFromSecretKey } from '../../utils';

function myParseInt(value: string) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (Number.isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

const helpText = `
Example call:
$ builderdao setAuthor --adminKp <bs58Secret> --address <bs58Pubkey> --tutorialId <tutorialId>
`;

export const AdminSetAuthorCommand = () => {
  const setAuthor = new commander.Command('setAuthor')
    .description('set the author of a migrated tutorial from LV2')
    .addHelpText('after', helpText);

  setAuthor
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
      new commander.Option('--address <address>', 'address of the new author')
        .argParser(val => new anchor.web3.PublicKey(val))
        .makeOptionMandatory(),
    )
    .addOption(
      new commander.Option('--tutorialId <tutorialId>', 'id of the tutorial')
        .argParser(val => myParseInt(val))
        .makeOptionMandatory(),
    )
    .action(
      async (options: {
        address: anchor.web3.PublicKey;
        adminKp: anchor.web3.Keypair;
        tutorialId: number;
      }) => {
        const solanaClient = getClient({
          network: setAuthor.optsWithGlobals().network,
          payer: options.adminKp,
        });
        const spinner = ora('Processing setAuthor');
        spinner.start();

        const signature = await solanaClient.proposalSetAuthor({
          id: options.tutorialId,
          creatorPk: options.address,
          adminKp: options.adminKp,
        });

        spinner.succeed(`signature: ${signature}`);
        spinner.stop();
      },
    );

  return setAuthor;
};
