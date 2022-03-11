import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';

const isReviewer = async (
  program: Program<Tutorial>,
  pdaReviewerAccount: any,
  walletPk: anchor.web3.PublicKey,
) => {
  const reviewerAccount = await pdaReviewerAccount(walletPk);
  const data = program.account.reviewerAccount.fetch(reviewerAccount.pda);
  return !!data;
};

export default isReviewer;
