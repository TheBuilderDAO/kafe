import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';

/**
 * @param program Dao program.
 * @param mintPk Mint of the token used for the vote.
 * @param adminPk User PrimaryKey for vote.
 * @param amount amount to create proposal.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const daoSetAmountToCreateProposal = async ({
  program,
  mintPk,
  adminPk,
  amount,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  adminPk: anchor.web3.PublicKey;
  amount: anchor.BN;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount } = getPda(program.programId, mintPk);
  const daoAccount = await pdaDaoAccount();

  const signature = await program.rpc.daoSetAmountToCreateProposal(amount, {
    accounts: {
      daoConfig: daoAccount.pda,
      authority: adminPk,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default daoSetAmountToCreateProposal;
