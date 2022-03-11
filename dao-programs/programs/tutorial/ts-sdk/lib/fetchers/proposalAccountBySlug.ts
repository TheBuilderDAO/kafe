import { Program } from '@project-serum/anchor';
import bs58 from 'bs58';

import { Tutorial } from '../idl/tutorial';

const proposalAccountBySlug = async (
  program: Program<Tutorial>,
  slug: string,
) => {
  const proposalAccount = await program.account.proposalAccount.all([
    {
      memcmp: {
        offset: 134,
        bytes: bs58.encode(Buffer.from(slug)),
      },
    },
  ]);
  return proposalAccount[0].account;
};

export default proposalAccountBySlug;
