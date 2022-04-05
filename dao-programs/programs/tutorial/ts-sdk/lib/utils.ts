import {
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  Commitment,
  GetProgramAccountsConfig,
} from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import bs58 from 'bs58';
import * as anchor from '@project-serum/anchor';
import RpcClient from 'jayson/lib/client/browser';

export const getNumberBuffer = (n: number, alloc = 8) => {
  const buffer = Buffer.alloc(alloc);
  buffer.writeUIntLE(n, 0, 6);
  return buffer;
};

export const getAta = async (
  ownerPk: PublicKey,
  mintPublicKey: PublicKey,
): Promise<PublicKey> => getAssociatedTokenAddress(mintPublicKey, ownerPk);

export const airdrop = async (provider: any, user: Keypair): Promise<void> => {
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(
      user.publicKey,
      20 * LAMPORTS_PER_SOL,
    ),
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

export const getProgramAccountArgs = (
  programId: PublicKey,
  provider: anchor.Provider,
  configOrCommitment?: GetProgramAccountsConfig | Commitment,
) => {
  const extra: Pick<GetProgramAccountsConfig, 'dataSlice' | 'filters'> = {};

  let commitment;
  let encoding;
  if (configOrCommitment) {
    if (typeof configOrCommitment === 'string') {
      commitment = configOrCommitment;
    } else {
      commitment = configOrCommitment.commitment;
      encoding = configOrCommitment.encoding;

      if (configOrCommitment.dataSlice) {
        extra.dataSlice = configOrCommitment.dataSlice;
      }
      if (configOrCommitment.filters) {
        extra.filters = configOrCommitment.filters;
      }
    }
  }

  const args = provider.connection._buildArgs(
    [programId.toBase58()],
    commitment,
    encoding || 'base64',
    extra,
  );
  return args;
};

export type RpcParams = {
  id?: string;
  methodName: string;
  args: Array<any>;
};

export type RpcBatchRequest = (requests: RpcParams[]) => any;

export function createRpcBatchRequest(client: RpcClient): RpcBatchRequest {
  return (requests: RpcParams[]) => {
    return new Promise((resolve, reject) => {
      // Do nothing if requests is empty
      if (requests.length === 0) resolve([]);

      const batch = requests.map((params: RpcParams) => {
        return client.request(params.methodName, params.args, params?.id);
      });

      client.request(batch, (err: any, response: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      });
    });
  };
}
