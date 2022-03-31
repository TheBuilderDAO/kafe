import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { filterReviewerByGithubLogin } from '../filters';

const reviewerAccountByGithubLogin = async (
  program: Program<Tutorial>,
  githubLogin: string,
) => {
  const reviewerAccounts = await program.account.reviewerAccount.all([
    ...filterReviewerByGithubLogin(githubLogin),
  ]);

  return reviewerAccounts[0].account;
};

export default reviewerAccountByGithubLogin;
