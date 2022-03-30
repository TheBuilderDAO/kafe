import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';

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
  mintKafe,
  mintBDR,
  proposalId,
  tipperPk,
  amount,
  signer,
}: {
  program: Program<Tutorial>;
  mintKafe: anchor.web3.PublicKey;
  mintBDR: anchor.web3.PublicKey;
  proposalId: number;
  tipperPk: anchor.web3.PublicKey;
  amount: anchor.BN;
  signer?: anchor.web3.Keypair;
}) => {
  const { pdaProposalById, pdaTipperAccount, pdaDaoVaultAccount } = getPda(
    program.programId,
  );
  const proposal = await pdaProposalById(proposalId);
  const tipper = await pdaTipperAccount(proposalId, tipperPk);
  const daoVaultKafeAccount = await pdaDaoVaultAccount(mintKafe);
  const daoVaultBdrAccount = await pdaDaoVaultAccount(mintBDR);

  const { creator, reviewer1, reviewer2 } =
    await program.account.proposalAccount.fetch(proposal.pda);

  const creatorTokenAccount = await getAssociatedTokenAddress(
    mintKafe,
    creator,
  );
  const reviewer1TokenAccount = await getAssociatedTokenAddress(
    mintKafe,
    reviewer1,
  );
  const reviewer2TokenAccount = await getAssociatedTokenAddress(
    mintKafe,
    reviewer2,
  );

  let associatedToken = await getAssociatedTokenAddress(mintBDR, tipperPk);

  const feePayer = !!signer
    ? signer.publicKey
    : program.provider.wallet.publicKey;
  const transaction = new anchor.web3.Transaction({ feePayer });

  let blockhash = (
    await program.provider.connection.getRecentBlockhash('finalized')
  ).blockhash;
  transaction.recentBlockhash = blockhash;

  try {
    await getAccount(program.provider.connection, associatedToken);
  } catch (error: unknown) {
    if (
      error instanceof TokenAccountNotFoundError ||
      error instanceof TokenInvalidAccountOwnerError
    ) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          program.provider.wallet.publicKey,
          associatedToken,
          program.provider.wallet.publicKey,
          mintBDR,
        ),
      );
    }
  }

  const instruction = program.instruction.guideTipping(
    tipper.bump,
    amount,
    daoVaultKafeAccount.bump,
    daoVaultBdrAccount.bump,
    {
      accounts: {
        tipperAccount: tipper.pda,
        proposal: proposal.pda,
        creator,
        reviewer2,
        reviewer1,
        signer: tipperPk,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        daoVaultKafe: daoVaultKafeAccount.pda,
        daoVaultBdr: daoVaultBdrAccount.pda,
        mintKafe: mintKafe,
        mintBdr: mintBDR,
        creatorTokenAccount: creatorTokenAccount,
        reviewer1TokenAccount: reviewer1TokenAccount,
        reviewer2TokenAccount: reviewer2TokenAccount,
        tipperTokenAccount: associatedToken,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      ...(signer && { signers: [signer] }),
    },
  );
  transaction.add(instruction);
  let signature;
  if (!signer) {
    const tx = await program.provider.wallet.signTransaction(transaction);
    signature = await program.provider.send(tx);
  } else {
    signature = await anchor.web3.sendAndConfirmTransaction(
      program.provider.connection,
      transaction,
      [signer],
    );
  }
  return signature;
};

export default guideTipping;
