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
  mintPk,
  reviewerPk,
  adminPk,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  reviewerPk: anchor.web3.PublicKey;
  adminPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaReviewerAccount } = getPda(
    program.programId,
    mintPk,
  );
  const daoConfig = await pdaDaoAccount();
  const reviewerAccount = await pdaReviewerAccount(reviewerPk);

  const signature = await program.rpc.reviewerDelete({
    accounts: {
      daoConfig: daoConfig.pda,
      reviewerAccount: reviewerAccount.pda,
      authority: adminPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default reviewerDelete;
