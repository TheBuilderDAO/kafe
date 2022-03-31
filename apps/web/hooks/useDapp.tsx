import React, { createContext, useContext, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SolanaApi, CeramicApi } from '@builderdao/apis';
import ApplicationFetcher from '../services/ApplicationFetcher';
import {
  TutorialProgramClient,
  TutorialProgramConfig,
  TutorialProgramContextProvider,
} from '@builderdao-sdk/dao-program';
import { Cluster, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import {
  CERAMIC_SEED,
  NEXT_PUBLIC_CERAMIC_NODE_URL,
  NEXT_PUBLIC_KAFE_MINT,
  NEXT_PUBLIC_BDR_MINT,
  NEXT_PUBLIC_SOLANA_NETWORK,
  NEXT_PUBLIC_SOLANA_NODE_URL,
} from '@app/constants';

type DappContextTypes = {
  applicationFetcher: ApplicationFetcher | null;
};

export const DappContext = createContext<DappContextTypes>({
  applicationFetcher: null,
});

type ApplicationFetcherConfig = {
  ceramicApiUrl?: string | null;
};

export const getApplicationFetcher = () => {
  const network = NEXT_PUBLIC_SOLANA_NETWORK as TutorialProgramConfig.Network;
  const url = NEXT_PUBLIC_SOLANA_NODE_URL || clusterApiUrl(network as Cluster);
  const connection = new Connection(url, 'confirmed');

  const solanaApi = new SolanaApi({
    connection,
    network,
    wallet: null,
    kafeMint: new PublicKey(NEXT_PUBLIC_KAFE_MINT),
    bdrMint: new PublicKey(NEXT_PUBLIC_BDR_MINT),
  });
  const ceramicApi = new CeramicApi({
    nodeUrl: NEXT_PUBLIC_CERAMIC_NODE_URL,
  });

  ceramicApi.setSeed(CERAMIC_SEED);

  return new ApplicationFetcher(solanaApi, ceramicApi);
};

type DappProviderProps = {
  children: JSX.Element;
  config?: ApplicationFetcherConfig;
};

let _tutorialProgram: TutorialProgramClient | null = null;

export const DappProvider = (props: DappProviderProps) => {
  const { children, config = {} } = props;
  const { connection } = useConnection();
  const wallet = useWallet();
  const network =
    (NEXT_PUBLIC_SOLANA_NETWORK as TutorialProgramConfig.Network) ||
    TutorialProgramConfig.Network.TESTNET;
  const solanaApi = new SolanaApi({
    wallet: wallet as any,
    connection,
    network,
    kafeMint: new PublicKey(NEXT_PUBLIC_KAFE_MINT),
    bdrMint: new PublicKey(NEXT_PUBLIC_BDR_MINT),
  });
  const ceramicApi = new CeramicApi({
    nodeUrl: config?.ceramicApiUrl || NEXT_PUBLIC_CERAMIC_NODE_URL,
  });

  const applicationFetcher = new ApplicationFetcher(solanaApi, ceramicApi);

  const tutorialProgram = useMemo(() => {
    return new TutorialProgramClient(
      connection,
      wallet as any,
      new PublicKey(NEXT_PUBLIC_KAFE_MINT),
      new PublicKey(NEXT_PUBLIC_BDR_MINT),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, wallet, wallet.connected]);

  return (
    <DappContext.Provider value={{ applicationFetcher }}>
      <TutorialProgramContextProvider value={{ tutorialProgram }}>
        {children}
      </TutorialProgramContextProvider>
    </DappContext.Provider>
  );
};

export const useDapp = () => {
  const { applicationFetcher } = useContext(DappContext);
  const { connection } = useConnection();
  const wallet = useWallet();

  return {
    wallet,
    connection,
    applicationFetcher,
  };
};
