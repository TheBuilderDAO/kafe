import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';

/**
 * @param program Dao program.
 * @param mintPk Mint publicKey of KAFE token.
 * @param reviewerPk publicKey of tthe reviewer.
 * @param adminPk admin publicKey.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const reviewerDelete = async ({
  program,
  reviewerPk,
  adminPk,
  force,
  signer,
}: {
  program: Program<Tutorial>;
  reviewerPk: anchor.web3.PublicKey;
  adminPk: anchor.web3.PublicKey;
  force?: boolean;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaReviewerAccount } = getPda(program.programId);
  const daoConfig = await pdaDaoAccount();
  const reviewerAccount = await pdaReviewerAccount(reviewerPk);

  const signature = await program.rpc.reviewerDelete(!!force, {
    accounts: {
      daoAccount: daoConfig.pda,
      reviewerAccount: reviewerAccount.pda,
      reviewer: reviewerPk,
      authority: adminPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default reviewerDelete;
