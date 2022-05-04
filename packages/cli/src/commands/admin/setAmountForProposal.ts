/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as commander from 'commander';
import ora from 'ora';

import { getClient } from '../../client';
import { createKeypairFromSecretKey } from '../../utils';

function myParseInt(value: string) {
  const parsedValue = parseInt(value, 10);
  if (Number.isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

const helpText = `
Modify the required amount to create a proposal. 
The new amount should be in KAFE unit (1 KAFE = 1_000_000 units).

Example call to admin:
$ builderdao admin setAmountForProposal --adminKp <bs58Secret> --amount <number>
`;

export const AdminSetAmountForProposal = () => {
  const setAmountForProposal = new commander.Command('setAmountForProposal')
    .description('Set KAFE amount to create proposal')
    .addHelpText(
      'after',
      helpText
    )

  setAmountForProposal
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
        '--amount <amount>',
        'new amount required to create a proposal',
      )
        .argParser(val => myParseInt(val))
        .makeOptionMandatory(),
    )
    .action(
      async (options) => {
        const client = getClient({
          network: setAmountForProposal.optsWithGlobals().network,
          payer: options.adminKp,
        });

        const spinner = ora('Processing transaction')
        spinner.start();

        const signature = await client.daoSetMinAmountForProposal({
          amount: options.amount,
          adminPk: options.adminKp,
        });

        spinner.succeed(`signature: ${signature}`);
        spinner.stop();
      },
    );

  return setAmountForProposal;
}