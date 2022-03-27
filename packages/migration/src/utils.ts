import * as bs58 from 'bs58';
import * as anchor from '@project-serum/anchor';
import fs from 'mz/fs';
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

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const loadKeypairJson = (path: string) =>
  Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(
        fs.readFileSync(path, {
          encoding: 'utf8',
        }),
      ),
    ),
  );

export const parseDifficulty = (value: string) => {
  switch (value) {
    case 'Beginner':
      return 'Beginner';
    case 'Intermediate':
      return 'Beginner';
    case 'Advanced':
      return 'Experienced';
    default:
      return 'Beginner';
  }
};

export const parseTags = (value: string) => {
  switch (value) {
    case 'Graphql':
      return 'GraphQL';
    case 'Smart Contracts':
      return 'Smart Contract';
    default:
      return capitalizeFirstLetter(value);
  }
};

export const parseSlug = (slug: string, protocol: string) => {
  if (!slug.startsWith(protocol)) {
    return `${protocol.toLowerCase()}-${slug}`;
  }
  return slug;
};

export const parseProtocol = (tags: string[]) => {
  switch (tags[0]) {
    case 'thegraph':
      return 'The Graph';
    default:
      return capitalizeFirstLetter(tags[0]);
  }
};
