import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';

const reviewerAccountList = async (program: Program<Tutorial>) =>
  program.account.reviewerAccount.all();

export default reviewerAccountList;
