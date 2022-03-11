import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';

const proposalAccountList = async (program: Program<Tutorial>) =>
  program.account.proposalAccount.all();

export default proposalAccountList;
