import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import { Tutorial } from '../idl/tutorial';
import { getPda } from '../pda';
import { getAta } from '../utils';

/**
 * @param program Dao program.
 * @param mintPk Mint publicKey of KAFE token.
 * @param tutorialId tutorial number.
 * @param userPk user PublicKey.
 * @param signer (optinal, default to provider.wallet.publicKey) signer of the transaction.
 * @returns signature of the transaction
 */
export const voteCast = async ({
  program,
  proposalId,
  mintBdrPk,
  voterPk,
  signer,
}: {
  program: Program<Tutorial>;
  proposalId: number;
  mintBdrPk: anchor.web3.PublicKey;
  voterPk: anchor.web3.PublicKey;
  signer?: anchor.web3.Keypair;
}) => {
  const {
    pdaDaoAccount,
    pdaUserVoteAccountById,
    pdaProposalById,
    pdaDaoVaultAccount,
  } = getPda(program.programId);
  const daoAccount = await pdaDaoAccount();
  const proposalAccount = await pdaProposalById(proposalId);
  const voteAccount = await pdaUserVoteAccountById(voterPk, proposalId);
  const { creator } = await program.account.proposalAccount.fetch(
    proposalAccount.pda,
  );
  const daoVaultBDRAccount = await pdaDaoVaultAccount(mintBdrPk);

  // const authorAtaBdr = await getAta(author, mintBdrPk);

  console.log(creator.toString());
  let associatedToken = await getAssociatedTokenAddress(mintBdrPk, creator);

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
          mintBdrPk,
        ),
      );
    }
  }

  const instruction = program.instruction.voteCast(
    voteAccount.bump,
    new anchor.BN(proposalId),
    daoVaultBDRAccount.bump,
    {
      accounts: {
        voteAccount: voteAccount.pda,
        daoAccount: daoAccount.pda,
        proposalAccount: proposalAccount.pda,
        systemProgram: anchor.web3.SystemProgram.programId,
        daoVaultBdr: daoVaultBDRAccount.pda,
        bdrTokenAccount: associatedToken,
        mintBdr: mintBdrPk,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        author: voterPk,
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

export default voteCast;
