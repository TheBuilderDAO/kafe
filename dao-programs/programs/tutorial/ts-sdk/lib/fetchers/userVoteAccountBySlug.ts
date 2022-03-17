import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';

const userVoteAccountBySlug = async (
  program: Program<Tutorial>,
  pdaTutorialBySlug: any,
  pdaUserVoteAccountBySlug: any,
  user: anchor.web3.PublicKey,
  slug: string,
) => {
  const proposalAccount = await pdaTutorialBySlug(slug);
  const { pda } = await pdaUserVoteAccountBySlug(user, proposalAccount.pda);
  return program.account.voteAccount.fetch(pda);
};

export default userVoteAccountBySlug;
