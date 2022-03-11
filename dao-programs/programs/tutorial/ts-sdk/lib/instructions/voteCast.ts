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
export const voteCast = async ({
  program,
  mintPk,
  tutorialId,
  userPk,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  tutorialId: number;
  userPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaUserVoteAccountById, pdaTutorialById } = getPda(
    program.programId,
    mintPk,
  );
  const daoAccount = await pdaDaoAccount();
  const proposalAccount = await pdaTutorialById(tutorialId);
  const voteAccount = await pdaUserVoteAccountById(userPk, tutorialId);

  const signature = await program.rpc.voteCast(
    voteAccount.bump,
    new anchor.BN(tutorialId),
    {
      accounts: {
        vote: voteAccount.pda,
        daoConfig: daoAccount.pda,
        tutorial: proposalAccount.pda,
        systemProgram: anchor.web3.SystemProgram.programId,
        mint: mintPk,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        author: userPk,
      },
      ...(signer && { signers: [signer] }),
    },
  );

  return signature;
};

export default voteCast;
