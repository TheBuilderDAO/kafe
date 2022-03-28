import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';
import { getAta } from '../utils';

/**
 * @param program Dao program.
 * @param mintPk  token mint pk.
 * @param admins list pk of admins.
 * @param payerPk payer pk of the transaction.
 * @param quorum number of voter to validate the transaction.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const daoVaultClose = async ({
  program,
  mintPk,
  amount,
  superAdminPk,
  freeze,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  amount: anchor.BN;
  superAdminPk: anchor.web3.PublicKey;
  freeze?: boolean;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaDaoVaultAccount } = getPda(program.programId);
  const daoAccount = await pdaDaoAccount();
  const daoVaultAccount = await pdaDaoVaultAccount(mintPk);
  const superAdminTokenAccount = await getAta(superAdminPk, mintPk);

  const signature = await program.rpc.daoVaultClose(
    daoVaultAccount.bump,
    amount,
    !!freeze,
    {
      accounts: {
        daoVault: daoVaultAccount.pda,
        daoAccount: daoAccount.pda,
        mint: mintPk,
        superAdmin: superAdminPk,
        superAdminTokenAccount: superAdminTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      ...(signer && { signers: [signer] }),
    },
  );

  return signature;
};

export default daoVaultClose;
