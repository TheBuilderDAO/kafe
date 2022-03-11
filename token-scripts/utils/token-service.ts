import { Keypair, Transaction } from '@solana/web3.js';
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { TransferEntryT } from './type';

export const transferIx = (
  transaction: Transaction,
  signers: Keypair[],
  {
    mintPk,
    authority,
    payer,
    fromAta,
    toAta,
    ownerPk,
    amountInBaseUnit,
    decimals,
    freeze,
  }: TransferEntryT,
) => {
  transaction.add(
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mintPk,
      toAta,
      ownerPk,
      payer.publicKey,
    ),
    Token.createTransferCheckedInstruction(
      TOKEN_PROGRAM_ID,
      fromAta,
      mintPk,
      toAta,
      payer.publicKey,
      [],
      amountInBaseUnit,
      decimals,
    ),
  );
  signers.push(payer);
  signers.push(payer);
  if (freeze) {
    transaction.add(
      Token.createFreezeAccountInstruction(
        TOKEN_PROGRAM_ID,
        toAta,
        mintPk,
        authority.publicKey,
        [],
      ),
    );
    signers.push(payer);
  }
};
