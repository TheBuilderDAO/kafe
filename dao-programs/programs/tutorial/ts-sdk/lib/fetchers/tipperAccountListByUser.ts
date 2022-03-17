import { Program } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import bs58 from 'bs58';

/**
 * This function return all tips done by a tipper
 * Can be use to collect the amount tips done by one user
 */
const tipperAccountListByUser = async (
  program: Program<Tutorial>,
  tipperPk: anchor.web3.PublicKey,
) => {
  return program.account.tipperAccount.all([
    {
      memcmp: {
        offset: 17,
        bytes: bs58.encode(tipperPk.toBuffer()),
      },
    },
  ]);
};

export default tipperAccountListByUser;
