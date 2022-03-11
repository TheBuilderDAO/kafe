import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';

/**
 * @param program Dao program.
 * @param mintPk  token mint pk.
 * @param userPk user publicKey to add to Kafe admin list.
 * @param adminPk admin publicKey to authorize the transaction.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const daoAddAdmin = async ({
  program,
  mintPk,
  userPk,
  adminPk,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  userPk: anchor.web3.PublicKey;
  adminPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount } = getPda(program.programId, mintPk);
  const daoAccount = await pdaDaoAccount();

  const signature = await program.rpc.daoAddAdmin(userPk, {
    accounts: {
      daoConfig: daoAccount.pda,
      signer: adminPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default daoAddAdmin;
