import { Program } from '@project-serum/anchor';
import bs58 from 'bs58';

import { Tutorial } from '../idl/tutorial';

const reviewerAccountByGithubLogin = async (
  program: Program<Tutorial>,
  githubLogin: string,
) => {
  const reviewerAccounts = await program.account.reviewerAccount.all([
    {
      memcmp: {
        offset: 46,
        bytes: bs58.encode(Buffer.from(githubLogin)),
      },
    },
  ]);
  return reviewerAccounts[0].account;
};

export default reviewerAccountByGithubLogin;
