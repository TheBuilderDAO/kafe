import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { filterProposalByStreamId } from '../filters';

const proposalAccountByStreamId = async (
  program: Program<Tutorial>,
  streamId: string,
) => {
  const proposalAccount = await program.account.proposalAccount.all([
    filterProposalByStreamId(streamId),
  ]);
  return proposalAccount[0].account;
};

export default proposalAccountByStreamId;
