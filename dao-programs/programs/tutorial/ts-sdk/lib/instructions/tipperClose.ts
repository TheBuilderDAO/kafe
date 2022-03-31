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
export const tipperClose = async ({
  program,
  guideId,
  tipperPk,
  adminPk,
  signer,
}: {
  program: Program<Tutorial>;
  guideId: number;
  tipperPk: anchor.web3.PublicKey;
  adminPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaTipperAccount } = getPda(program.programId);
  const daoAccount = await pdaDaoAccount();
  const tipperAccount = await pdaTipperAccount(guideId, tipperPk);

  const signature = await program.rpc.tipperClose({
    accounts: {
      daoAccount: daoAccount.pda,
      tipperAccount: tipperAccount.pda,
      tipper: tipperPk,
      authority: adminPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default tipperClose;
