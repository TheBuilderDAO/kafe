import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';
import { getAta } from '../utils';

/**
 * @param program Dao program.
 * @param mintPk  token mint pk.
 * @param tutorialId tutorial id.
 * @param adminPk admin pk of the transaction.
 * @param newState new program state.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const proposalPublish = async ({
  program,
  mintPk,
  tutorialId,
  authorPk,
  adminPk,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  tutorialId: number;
  authorPk: anchor.web3.PublicKey;
  adminPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaTutorialById, pdaDaoVaultAccount } = getPda(
    program.programId,
    mintPk,
  );
  const authorAta = await getAta(authorPk, mintPk);
  const daoAccount = await pdaDaoAccount();
  const daoVaultAccount = await pdaDaoVaultAccount();
  const proposalAccount = await pdaTutorialById(tutorialId);

  const signature = await program.rpc.proposalPublish(daoVaultAccount.bump, {
    accounts: {
      proposal: proposalAccount.pda,
      daoConfig: daoAccount.pda,
      daoVaultKafe: daoVaultAccount.pda,
      mintKafe: mintPk,
      signer: adminPk,
      userTokenAccount: authorAta,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default proposalPublish;
