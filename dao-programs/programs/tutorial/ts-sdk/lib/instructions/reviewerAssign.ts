import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';

/**
 * @param program Dao program.
 * @param mintPk  token mint pk.
 * @param reviewer1Pk publickey for the first reviewer.
 * @param reviewer2Pk publickey for the second reviewer.
 * @param tutorialId tutorial Id.
 * @param adminPk admin publicKey.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const reviewerAssign = async ({
  program,
  mintPk,
  reviewer1Pk,
  reviewer2Pk,
  slug,
  adminPk,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  reviewer1Pk: anchor.web3.PublicKey;
  reviewer2Pk: anchor.web3.PublicKey;
  slug: string;
  adminPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaReviewerAccount, pdaTutorialBySlug } = getPda(
    program.programId,
    mintPk,
  );
  const daoAccount = await pdaDaoAccount();
  const tutorialAccount = await pdaTutorialBySlug(slug);
  const reviewerAccount1 = await pdaReviewerAccount(reviewer1Pk);
  const reviewerAccount2 = await pdaReviewerAccount(reviewer2Pk);

  const signature = await program.rpc.reviewerAssign({
    accounts: {
      reviewer1: reviewerAccount1.pda,
      reviewer2: reviewerAccount2.pda,
      daoConfig: daoAccount.pda,
      tutorial: tutorialAccount.pda,
      authority: adminPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default reviewerAssign;
