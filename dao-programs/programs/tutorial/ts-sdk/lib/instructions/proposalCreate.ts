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
 * @param userPk creator pk of the proposal.
 * @param slug slug of the proposal.
 * @param streamId streamId (Ceramic) of the proposal.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const proposalCreate = async ({
  program,
  mintPk,
  mintBdrPk,
  proposalId,
  userPk,
  slug,
  streamId,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  mintBdrPk: anchor.web3.PublicKey;
  proposalId: number;
  userPk: anchor.web3.PublicKey;
  slug: string;
  streamId: string;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaDaoVaultAccount, pdaProposalById } = getPda(
    program.programId,
  );
  const userAta = await getAta(userPk, mintPk);
  const authorAtaBdr = await getAta(userPk, mintBdrPk);
  const daoAccount = await pdaDaoAccount();
  const daoVaultBDRAccount = await pdaDaoVaultAccount(mintBdrPk);
  const daoVaultAccount = await pdaDaoVaultAccount(mintPk);
  const proposalAccount = await pdaProposalById(proposalId);

  const signature = await program.rpc.proposalCreate(
    proposalAccount.bump,
    daoVaultBDRAccount.bump,
    slug,
    streamId,
    {
      accounts: {
        proposalAccount: proposalAccount.pda,
        daoAccount: daoAccount.pda,
        daoVault: daoVaultAccount.pda,
        mint: mintPk,
        mintBdr: mintBdrPk,
        bdrTokenAccount: authorAtaBdr,
        daoVaultBdr: daoVaultBDRAccount.pda,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        payer: userPk,
        userTokenAccount: userAta,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      ...(signer && { signers: [signer] }),
    },
  );

  return signature;
};

export default proposalCreate;
