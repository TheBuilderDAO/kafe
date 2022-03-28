import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { proposalAccountById } from '../fetchers';

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
  reviewer1Pk,
  reviewer2Pk,
  proposalId,
  adminPk,
  force,
  signer,
}: {
  program: Program<Tutorial>;
  reviewer1Pk: anchor.web3.PublicKey;
  reviewer2Pk: anchor.web3.PublicKey;
  proposalId: number;
  adminPk: anchor.web3.PublicKey;
  force?: boolean;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaReviewerAccount, pdaProposalById } = getPda(
    program.programId,
  );
  const daoAccount = await pdaDaoAccount();
  const tutorialAccount = await pdaProposalById(proposalId);
  const reviewerAccount1 = await pdaReviewerAccount(reviewer1Pk);
  const reviewerAccount2 = await pdaReviewerAccount(reviewer2Pk);
  const { reviewer1: prevReviewer1_0, reviewer2: prevReviewer2_0 } =
    await proposalAccountById(program, pdaProposalById, proposalId);
  const prevReviewer1 = await pdaReviewerAccount(prevReviewer2_0);
  const prevReviewer2 = await pdaReviewerAccount(prevReviewer1_0);

  const signature = await program.rpc.reviewerAssign(!!force, {
    accounts: {
      reviewer1: reviewerAccount1.pda,
      reviewer2: reviewerAccount2.pda,
      prevReviewer1: prevReviewer1.pda,
      prevReviewer2: prevReviewer2.pda,
      daoAccount: daoAccount.pda,
      proposalAccount: tutorialAccount.pda,
      authority: adminPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default reviewerAssign;
