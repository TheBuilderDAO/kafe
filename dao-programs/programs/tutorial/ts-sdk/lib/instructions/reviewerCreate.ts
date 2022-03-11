import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';

/**
 * @param program Dao program.
 * @param mintPk  Mint of the token used for the vote.
 * @param adminPk admin publicKey.
 * @param reviewerPk reviewer PublicKey.
 * @param githubName (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const reviewerCreate = async ({
  program,
  mintPk,
  adminPk,
  reviewerPk,
  githubName,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  adminPk: anchor.web3.PublicKey;
  reviewerPk: anchor.web3.PublicKey;
  githubName: string;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaReviewerAccount } = getPda(
    program.programId,
    mintPk,
  );
  const daoAccount = await pdaDaoAccount();
  const reviewerAccount = await pdaReviewerAccount(reviewerPk);

  const signature = await program.rpc.reviewerCreate(
    reviewerAccount.bump,
    reviewerPk,
    githubName,
    {
      accounts: {
        reviewerAccount: reviewerAccount.pda,
        daoConfig: daoAccount.pda,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        authority: adminPk,
      },
      ...(signer && { signers: [signer] }),
    },
  );

  return signature;
};

export default reviewerCreate;
