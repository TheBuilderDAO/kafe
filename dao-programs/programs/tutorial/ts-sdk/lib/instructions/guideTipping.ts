import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';

/**
 * @param program Dao program.
 * @param mintPk  token mint pk.
 * @param proposalId tutorial Id.
 * @param tipperPk user publicKey.
 * @param amount amount to distribute among reviewers and creator.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const guideTipping = async ({
  program,
  mintPk,
  proposalId,
  tipperPk,
  amount,
  signer,
}: {
  program: Program<Tutorial>;
  mintPk: anchor.web3.PublicKey;
  proposalId: number;
  tipperPk: anchor.web3.PublicKey;
  amount: anchor.BN;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaTutorialById, pdaTipperAccount } = getPda(
    program.programId,
    mintPk,
  );
  const proposal = await pdaTutorialById(proposalId);
  const tipper = await pdaTipperAccount(proposalId, tipperPk);
  const { creator, reviewer1, reviewer2 } =
    await program.account.proposalAccount.fetch(proposal.pda);

  const signature = await program.rpc.guideTipping(tipper.bump, amount, {
    accounts: {
      tipper: tipper.pda,
      proposal: proposal.pda,
      signer: tipperPk,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      creator,
      reviewer1,
      reviewer2,
    },
    ...(signer && { signers: [signer] }),
  });

  return signature;
};

export default guideTipping;
