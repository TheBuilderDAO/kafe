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
  proposalId,
  authorPk,
  userPk,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  proposalId: number;
  authorPk: anchor.web3.PublicKey;
  userPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaProposalById, pdaDaoVaultAccount } = getPda(
    program.programId,
  );
  const userAta = await getAta(userPk, mintPk);
  const daoAccount = await pdaDaoAccount();
  const proposalAccount = await pdaProposalById(proposalId);
  const daoVaultAccount = await pdaDaoVaultAccount(mintPk);

  const signature = await program.rpc.proposalClose(daoVaultAccount.bump, {
    accounts: {
      proposalAccount: proposalAccount.pda,
      daoAccount: daoAccount.pda,
      daoVault: daoVaultAccount.pda,
      creator: authorPk,
      mint: mintPk,
      userTokenAccount: userAta,
      tokenProgram: TOKEN_PROGRAM_ID,
      authority: userPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default proposalClose;
