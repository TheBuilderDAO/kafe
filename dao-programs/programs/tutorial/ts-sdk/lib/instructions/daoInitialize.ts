import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getPda } from '../pda';

/**
 * @param program Dao program.
 * @param mintPk  token mint pk.
 * @param admins list pk of admins.
 * @param payerPk payer pk of the transaction.
 * @param quorum number of voter to validate the transaction.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const daoInitialize = async ({
  program,
  mintPk,
  admins,
  payerPk,
  quorum,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  admins: anchor.web3.PublicKey[];
  payerPk: anchor.web3.PublicKey;
  quorum: anchor.BN;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaDaoVaultAccount } = getPda(
    program.programId,
    mintPk,
  );
  const daoAccount = await pdaDaoAccount();
  const daoVaultAccount = await pdaDaoVaultAccount();

  const signature = await program.rpc.daoInitialize(
    daoAccount.bump,
    quorum,
    admins,
    {
      accounts: {
        daoConfig: daoAccount.pda,
        daoVault: daoVaultAccount.pda,
        mint: mintPk,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        payer: payerPk,
      },
      ...(signer && { signers: [signer] }),
    },
  );

  return signature;
};

export default daoInitialize;
