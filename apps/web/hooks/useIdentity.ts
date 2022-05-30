import { ThreeIdConnect } from '@3id/connect';
import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { DID } from 'dids';
import { solana } from '@ceramicnetwork/blockchain-utils-linking';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

const CERAMIC_URL = 'https://ceramic-clay.3boxlabs.com';

export const useIdentity = () => {
  const connection = useConnection();
  const wallet = useWallet();
  const [currentUserDid, setCurrentUserDid] = useState<string>(null);

  useEffect(() => {
    const initLogin = async () => {
      const did = await authenticate();

      setCurrentUserDid(did);
    };

    if (wallet.connected) {
      initLogin();
    } else {
      setCurrentUserDid(null);
    }
  }, [wallet.connected]);

  const authenticate = async () => {
    const threeIdConnect = new ThreeIdConnect();
    const authProvider = new solana.SolanaAuthProvider(
      wallet,
      wallet.publicKey.toString(),
      solana.SOLANA_TESTNET_CHAIN_REF,
    );
    await threeIdConnect.connect(authProvider);

    const ceramic = new CeramicClient(CERAMIC_URL);
    const did = new DID({
      provider: threeIdConnect.getDidProvider(),
      resolver: get3IDResolver(ceramic),
    });

    await did.authenticate();
    console.log('YOUR DID IS: ', did.id);

    const jws = await did.createJWS({ hello: 'world' });
    console.log(jws);

    return did.id;
  };

  return {
    currentUserDid,
    authenticate,
  };
};
