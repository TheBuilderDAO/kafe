import { Program } from '@project-serum/anchor';
import bs58 from 'bs58';

import { Tutorial } from '../idl/tutorial';
import { getNumberBuffer } from '../utils';

const proposalAccountById = async (program: Program<Tutorial>, id: number) => {
  const proposalAccount = await program.account.proposalAccount.all([
    {
      memcmp: {
        offset: 8,
        bytes: bs58.encode(getNumberBuffer(id)),
      },
    },
  ]);
  return proposalAccount[0].account;
};

export default proposalAccountById;
