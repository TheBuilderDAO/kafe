import { Provider } from '@project-serum/anchor';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';

import { connectionURL } from '.';

export async function airdrop(
  connection: Connection,
  publicKey: PublicKey,
  sol = 1,
) {
  const sig = await connection.requestAirdrop(
    publicKey,
    sol * LAMPORTS_PER_SOL,
  );
  return connection.confirmTransaction(sig);
}

const opts: { commitment: Commitment } = {
  commitment: 'processed',
};

export const createPrerequisites = async () => {
  const payer = Keypair.generate();

  const connection = new Connection(connectionURL, 'confirmed');

  const wallet = new NodeWallet(payer);

  const provider = new Provider(connection, wallet, opts);
  await airdrop(connection, payer.publicKey);

  return { payer, connection, wallet, provider };
};
