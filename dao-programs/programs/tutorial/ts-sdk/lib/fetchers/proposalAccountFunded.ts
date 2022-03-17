import { Program } from '@project-serum/anchor';
import bs58 from 'bs58';

import { Tutorial } from '../idl/tutorial';

const proposalAccountFunded = async (program: Program<Tutorial>) => {
  const proposalAccount = await program.account.proposalAccount.all([
    {
      memcmp: {
        offset: 16,
        bytes: bs58.encode(new Uint8Array([1])),
      },
    },
  ]);
  return proposalAccount;
};

export default proposalAccountFunded;
