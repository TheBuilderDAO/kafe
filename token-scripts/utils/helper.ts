import {
  Connection,
  Keypair,
  clusterApiUrl,
  Cluster,
  PublicKey,
} from '@solana/web3.js';
import fs from 'mz/fs';
import path from 'path';
import { TokenConfigI, TokenInfoT } from './type';
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export const getAta = async (
  authorityPublicKey: PublicKey,
  mintPublicKey: PublicKey,
): Promise<PublicKey> =>
  await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mintPublicKey,
    authorityPublicKey,
  );

export const fromConfig = ({
  symbol,
  keypair,
  decimals,
  supply,
  freeze,
  authority,
}: TokenConfigI) => {
  return {
    authority: loadKeypairJson(path.join(...authority)),
    mint: loadKeypairJson(path.join(...keypair)),
    supply,
    freeze,
    symbol,
    decimals,
    supplyInBaseUnit: toBaseUnit(supply, decimals),
  };
};

export const getConnection = () => new Connection(clusterUrl(), 'confirmed');

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

export const loadTokens = (): TokenInfoT[] =>
  JSON.parse(
    fs.readFileSync('tokens.json', {
      encoding: 'utf8',
    }),
  );

export const getTokenInfo = () =>
  new Map(
    Array.from(
      loadTokens().map(tokenInfo => {
        return [
          tokenInfo.symbol,
          {
            symbol: tokenInfo.symbol,
            keypair: loadKeypairJson(path.join(...tokenInfo.keypair)),
            decimals: tokenInfo.decimals,
            supply: tokenInfo.supply,
            freeze: tokenInfo.freeze,
            authority: loadKeypairJson(path.join(...tokenInfo.authority)),
          },
        ];
      }),
    ),
  );

export const clusterUrl = () =>
  process.env.cluster
    ? clusterApiUrl(process.env.cluster as Cluster)
    : 'http://127.0.0.1:8899';

export const parseCsv = (path: string) =>
  fs
    .readFileSync(path, {
      encoding: 'utf8',
    })
    .split(/\r?\n/)
    .map(line => {
      const [pk, amount, symbol] = line.split(',');
      return {
        pk,
        amount,
        symbol,
      };
    });

export const numberWithCommas = (x: number) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const toBaseUnit = (amount: number, decimals: number) =>
  amount * 10 ** decimals;

export const fromBaseUnit = (amount: number, decimals: number) =>
  amount / 10 ** decimals;
