import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  Token,
  TOKEN_PROGRAM_ID,
  MintLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { CreateTokenI } from './type';

export const getMintRentExempt = async (connection: Connection) =>
  await Token.getMinBalanceRentForExemptMint(connection);

export const createToken = async ({
  connection,
  mint,
  authority,
  authorityAta,
  decimals,
  supplyInBaseUnit,
  rentExempt,
}: CreateTokenI): Promise<string> => {
  const freezeAuthority = authority.publicKey;

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: authority.publicKey,
      newAccountPubkey: mint.publicKey,
      space: MintLayout.span,
      lamports: rentExempt,
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      decimals,
      authority.publicKey,
      freezeAuthority,
    ),
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      authorityAta,
      authority.publicKey,
      authority.publicKey,
    ),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      authorityAta,
      authority.publicKey,
      [],
      supplyInBaseUnit,
    ),
  );
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    authority,
    mint,
    authority,
    authority,
  ]);
  return signature;
};
