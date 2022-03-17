import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';

const proposalAccountBySlug = async (
  program: Program<Tutorial>,
  pdaTutorialBySlug: any,
  slug: string,
) => {
  const { pda } = await pdaTutorialBySlug(slug);
  return await program.account.proposalAccount.fetch(pda);
};

export default proposalAccountBySlug;
