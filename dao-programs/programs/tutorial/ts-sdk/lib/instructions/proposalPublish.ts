import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';
import { getAta } from '../utils';

/**
 * @param program Dao program.
 * @param mintPk  token mint pk.
 * @param proposalId tutorial id.
 * @param adminPk admin pk of the transaction.
 * @param newState new program state.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const proposalPublish = async ({
  program,
  mintPk,
  proposalId,
  authorPk,
  adminPk,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  proposalId: number;
  authorPk: anchor.web3.PublicKey;
  adminPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaProposalById, pdaDaoVaultAccount } = getPda(
    program.programId,
  );
  const authorAta = await getAta(authorPk, mintPk);
  const daoAccount = await pdaDaoAccount();
  const daoVaultAccount = await pdaDaoVaultAccount(mintPk);
  const proposalAccount = await pdaProposalById(proposalId);

  const signature = await program.rpc.proposalPublish(daoVaultAccount.bump, {
    accounts: {
      proposalAccount: proposalAccount.pda,
      daoAccount: daoAccount.pda,
      daoVaultKafe: daoVaultAccount.pda,
      mintKafe: mintPk,
      authority: adminPk,
      userTokenAccount: authorAta,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default proposalPublish;
