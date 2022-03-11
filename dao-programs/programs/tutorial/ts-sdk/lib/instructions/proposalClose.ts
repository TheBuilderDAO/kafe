import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';
import { getAta } from '../utils';

/**
 * @param program Dao program.
 * @param mintPk  token mint pk.
 * @param admins list pk of admins.
 * @param tutorialId tutorial Id.
 * @param userPk user publicKey.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const proposalClose = async ({
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
  const { pdaDaoAccount, pdaTutorialById, pdaDaoVaultAccount } = getPda(
    program.programId,
    mintPk,
  );
  const userAta = await getAta(userPk, mintPk);
  const daoAccount = await pdaDaoAccount();
  const proposalAccount = await pdaTutorialById(tutorialId);
  const daoVaultAccount = await pdaDaoVaultAccount();

  const signature = await program.rpc.proposalClose(daoVaultAccount.bump, {
    accounts: {
      proposal: proposalAccount.pda,
      daoConfig: daoAccount.pda,
      daoVault: daoVaultAccount.pda,
      mint: mintPk,
      userTokenAccount: userAta,
      tokenProgram: TOKEN_PROGRAM_ID,
      creator: userPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default proposalClose;
