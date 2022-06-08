import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';

export const reviewerAccountByReviewerPK = async (
  program: Program<Tutorial>,
  pdaReviewerAccount: any,
  reviewerPk: anchor.web3.PublicKey,
) => {
  const reviewerAccount = await pdaReviewerAccount(reviewerPk);
  return reviewerAccountByReviewerAccountPDA(program, reviewerAccount.pda);
};

export const reviewerAccountByReviewerAccountPDA = async (
  program: Program<Tutorial>,
  reviewerAccountPk: anchor.web3.PublicKey,
) => ({
  ...(await program.account.reviewerAccount.fetch(reviewerAccountPk)),
  pda: reviewerAccountPk,
});
