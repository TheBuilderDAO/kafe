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
  tutorialId,
  userPk,
  slug,
  streamId,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  tutorialId: number;
  userPk: anchor.web3.PublicKey;
  slug: string;
  streamId: string;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaDaoVaultAccount, pdaTutorialById } = getPda(
    program.programId,
    mintPk,
  );
  const userAta = await getAta(userPk, mintPk);
  const daoAccount = await pdaDaoAccount();
  const daoVaultAccount = await pdaDaoVaultAccount();
  const proposalAccount = await pdaTutorialById(tutorialId);

  const signature = await program.rpc.proposalCreate(
    proposalAccount.bump,
    new anchor.BN(tutorialId),
    slug,
    streamId,
    {
      accounts: {
        proposal: proposalAccount.pda,
        daoConfig: daoAccount.pda,
        daoVault: daoVaultAccount.pda,
        mint: mintPk,
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
