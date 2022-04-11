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

export const airdrop = async ({
  program,
  memberPk,
  mintKafePk,
  mintBdrPk,
  kafeDrop,
  bdrDrop,
  authority,
}: {
  program: Program<Tutorial>;
  memberPk: anchor.web3.PublicKey;
  mintKafePk: anchor.web3.PublicKey;
  mintBdrPk: anchor.web3.PublicKey;
  kafeDrop?: boolean;
  bdrDrop?: boolean;
  authority: anchor.web3.Keypair;
}) => {
  const { pdaDaoAccount, pdaDaoVaultAccount } = getPda(program.programId);
  const daoAccount = await pdaDaoAccount();
  const vaultKafe = await pdaDaoVaultAccount(mintKafePk);
  const vaultBdr = await pdaDaoVaultAccount(mintBdrPk);

  let kafeAssociatedToken = await getAssociatedTokenAddress(
    mintKafePk,
    memberPk,
  );
  let bdrAssociatedToken = await getAssociatedTokenAddress(mintBdrPk, memberPk);

  const feePayer = authority.publicKey;
  const transaction = new anchor.web3.Transaction({ feePayer });

  let blockhash = (
    await program.provider.connection.getRecentBlockhash('finalized')
  ).blockhash;
  transaction.recentBlockhash = blockhash;

  try {
    await getAccount(program.provider.connection, kafeAssociatedToken);
  } catch (error: unknown) {
    if (
      error instanceof TokenAccountNotFoundError ||
      error instanceof TokenInvalidAccountOwnerError
    ) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          feePayer,
          kafeAssociatedToken,
          memberPk,
          mintKafePk,
        ),
      );
    }
  }

  try {
    await getAccount(program.provider.connection, bdrAssociatedToken);
  } catch (error: unknown) {
    if (
      error instanceof TokenAccountNotFoundError ||
      error instanceof TokenInvalidAccountOwnerError
    ) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          feePayer,
          bdrAssociatedToken,
          memberPk,
          mintBdrPk,
        ),
      );
    }
  }

  const instruction = await program.instruction.airdrop(
    vaultKafe.bump,
    vaultBdr.bump,
    !kafeDrop,
    !bdrDrop,
    {
      accounts: {
        daoAccount: daoAccount.pda,
        daoVaultKafe: vaultKafe.pda,
        daoVaultBdr: vaultBdr.pda,
        mintKafe: mintKafePk,
        mintBdr: mintBdrPk,
        tokenProgram: TOKEN_PROGRAM_ID,
        bdrTokenAccount: bdrAssociatedToken,
        kafeTokenAccount: kafeAssociatedToken,
        authority: authority.publicKey,
      },
      signers: [authority],
    },
  );
  transaction.add(instruction);

  const signature = await anchor.web3.sendAndConfirmTransaction(
    program.provider.connection,
    transaction,
    [authority],
  );

  return signature;
};

export default airdrop;
