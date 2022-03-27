import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';

const proposalAccountById = async (
  program: Program<Tutorial>,
  pdaProposalById: any,
  id: number,
) => {
  const proposal = await pdaProposalById(id);
  return await program.account.proposalAccount.fetch(proposal.pda);
};

export default proposalAccountById;
