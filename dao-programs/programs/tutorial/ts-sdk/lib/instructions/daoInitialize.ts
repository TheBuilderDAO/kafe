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
export const daoInitialize = async ({
  program,
  minAmountToCreateProposal,
  admins,
  superAdmin,
  payerPk,
  quorum,
  signer,
}: {
  program: Program<Tutorial>;
  minAmountToCreateProposal: anchor.BN;
  superAdmin: anchor.web3.PublicKey;
  admins: anchor.web3.PublicKey[];
  payerPk: anchor.web3.PublicKey;
  quorum: anchor.BN;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount } = getPda(program.programId);
  const daoAccount = await pdaDaoAccount();

  const signature = await program.rpc.daoInitialize(
    daoAccount.bump,
    quorum,
    minAmountToCreateProposal,
    superAdmin,
    admins,
    {
      accounts: {
        daoAccount: daoAccount.pda,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        payer: payerPk,
      },
      ...(signer && { signers: [signer] }),
    },
  );

  return signature;
};

export default daoInitialize;
