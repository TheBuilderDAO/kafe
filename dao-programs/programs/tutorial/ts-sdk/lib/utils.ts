import { PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import bs58 from 'bs58';

export const getNumberBuffer = (n: number, alloc = 8) => {
  const buffer = Buffer.alloc(alloc);
  buffer.writeUIntLE(n, 0, 6);
  return buffer;
};

export const getAta = async (
  ownerPk: PublicKey,
  mintPublicKey: PublicKey,
): Promise<PublicKey> =>
  Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mintPublicKey,
    ownerPk,
  );

export const airdrop = async (provider: any, user: Keypair): Promise<void> => {
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(user.publicKey, LAMPORTS_PER_SOL),
    'confirmed',
  );
};

export const airdrops = async (
  provider: any,
  users: Keypair[],
): Promise<void> => {
  for (let user of users) {
    await airdrop(provider, user);
  }
};

export const stringToBytes = (str: string) => bs58.encode(Buffer.from(str));

export const numberToBytes = (id: number) => bs58.encode(getNumberBuffer(id));

export const publicKeyToBytes = (pk: PublicKey) => bs58.encode(pk.toBuffer());
