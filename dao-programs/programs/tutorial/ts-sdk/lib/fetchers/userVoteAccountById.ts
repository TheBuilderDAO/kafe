import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';

const userVoteAccountById = async (
  program: Program<Tutorial>,
  pdaUserVoteAccountById: any,
  user: anchor.web3.PublicKey,
  id: number,
) => {
  const userVoteById = await pdaUserVoteAccountById(user, id);
  return program.account.voteAccount.fetch(userVoteById.pda);
};

export default userVoteAccountById;
