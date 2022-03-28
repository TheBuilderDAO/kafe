import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
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
export const daoClose = async ({
  program,
  superAdminPk,
  signer,
}: {
  program: Program<Tutorial>;
  superAdminPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount } = getPda(program.programId);
  const daoAccount = await pdaDaoAccount();

  const signature = await program.rpc.daoClose({
    accounts: {
      daoAccount: daoAccount.pda,
      superAdmin: superAdminPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default daoClose;
