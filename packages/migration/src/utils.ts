import * as bs58 from 'bs58';
import * as anchor from '@project-serum/anchor';
import { Keypair } from '@solana/web3.js';

export const createKeypairFromSecretKey = (secretKey: string) => {
  const array = Uint8Array.from(bs58.decode(secretKey));
  return anchor.web3.Keypair.fromSecretKey(array);
};

export const encodeKeypairSecretKey = (keypair: Keypair) =>
  bs58.encode(keypair.secretKey);

export const compareBySlug = (a: any, b: any) => {
    if (a.slug < b.slug) {
      return -1;
    }
    if (a.slug > b.slug) {
      return 1;
    }
    return 0;
  };

export const compareById = (a: any, b: any) => {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  };