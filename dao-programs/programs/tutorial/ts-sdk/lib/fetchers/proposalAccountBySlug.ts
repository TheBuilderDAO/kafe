import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { filterProposalBySlug } from '../filters';

const proposalAccountBySlug = async (
  program: Program<Tutorial>,
  slug: string,
) => {
  const proposalAccount = await program.account.proposalAccount.all([
    ...filterProposalBySlug(slug),
  ]);
  return proposalAccount[0].account;
};

export default proposalAccountBySlug;
