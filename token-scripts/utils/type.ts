import { Keypair, Connection, PublicKey } from '@solana/web3.js';

export type ParsedCsvEntryT = {
  pk: string;
  amount: string;
  symbol: string;
};

export interface TokenConfigI {
  symbol: string;
  keypair: string[];
  decimals: number;
  supply: number;
  freeze: boolean;
  authority: string[];
}

export interface CreateTokenI {
  connection: Connection;
  mint: Keypair;
  authority: Keypair;
  authorityAta: PublicKey;
  decimals: number;
  supplyInBaseUnit: number;
  rentExempt: number;
}

export type TokenInfoT = {
  symbol: string;
  keypair: string[];
  decimals: number;
  supply: number;
  freeze: boolean;
  authority: string[];
};

export interface TransferEntryT {
  mintPk: PublicKey;
  authority: Keypair;
  payer: Keypair;
  fromAta: PublicKey;
  toAta: PublicKey;
  ownerPk: PublicKey;
  amountInBaseUnit: number;
  decimals: number;
  freeze: boolean;
}
