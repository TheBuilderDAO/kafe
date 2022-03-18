import { Program } from '@project-serum/anchor';
import bs58 from 'bs58';

import { Tutorial } from '../idl/tutorial';
import { getNumberBuffer } from '../utils';

/**
 * This function return all tippers for a given guide_id
 * Can be use to have the list of supporters for a guide
 */
const tipperAccountListById = async (
  program: Program<Tutorial>,
  guide_id: number,
) => {
  return program.account.tipperAccount.all([
    {
      memcmp: {
        offset: 8,
        bytes: bs58.encode(getNumberBuffer(guide_id)),
      },
    },
  ]);
};

export default tipperAccountListById;
