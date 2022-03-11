import debug from 'debug';
import { clusterApiUrl } from '@solana/web3.js';

export const LOCALHOST = 'http://127.0.0.1:8899/';

export const logDebug = debug('builderdao:tutorial-test:debug');

export const DEVNET = clusterApiUrl('devnet');
export const connectionURL =
  process.env.USE_DEVNET != null ? DEVNET : LOCALHOST;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve: any) => setTimeout(resolve, ms));
}
