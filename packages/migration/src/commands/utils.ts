/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import commander from 'commander';
import * as bs58 from 'bs58';

import { loadKeypairJson } from '../utils';

export const makeUtilsCommand = () => {
  const utils = new commander.Command('utils').description(
    'Solana utilities command',
  );

  utils
    .command('bs58')
    .addOption(
      new commander.Option(
        '--path <path>',
        'keypair json file',
      ).makeOptionMandatory(),
    )
    .action(async options => {
      const keypair = loadKeypairJson(options.path);
      console.log(bs58.encode(keypair.secretKey));
    });

  return utils;
};
