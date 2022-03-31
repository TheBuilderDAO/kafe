import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';

/**
 * @param program Dao program.
 * @param mintPk Mint publicKey of KAFE token.
 * @param tutorialId tutorial number.
 * @param userPk user PublicKey.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const voteCancel = async ({
  program,
  proposalId,
  voterPk,
  authorPk,
  signer,
}: {
  program: Program<Tutorial>;
  proposalId: number;
  authorPk: anchor.web3.PublicKey;
  voterPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaUserVoteAccountById, pdaProposalById } = getPda(
    program.programId,
  );
  const daoAccount = await pdaDaoAccount();
  const proposalAccount = await pdaProposalById(proposalId);
  const voteAccount = await pdaUserVoteAccountById(voterPk, proposalId);

  const signature = await program.rpc.voteCancel({
    accounts: {
      voteAccount: voteAccount.pda,
      daoAccount: daoAccount.pda,
      proposalAccount: proposalAccount.pda,
      author: authorPk,
      authority: voterPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default voteCancel;
