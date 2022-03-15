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
  const network = process.env
    .NEXT_PUBLIC_SOLANA_NETWORK as TutorialProgramConfig.Network;
  const url =
    process.env.NEXT_PUBLIC_SOLANA_NODE_URL ||
    clusterApiUrl(network as Cluster);
  const connection = new Connection(url, 'confirmed');

  const solanaApi = new SolanaApi({
    connection,
    network,
    wallet: null,
    kafeMint: new PublicKey(process.env.NEXT_PUBLIC_KAFE_MINT),
  });
  const ceramicApi = new CeramicApi({
    nodeUrl: process.env.NEXT_PUBLIC_CERAMIC_NODE_URL,
  });

  ceramicApi.setSeed(process.env.CERAMIC_SEED);

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
    (process.env.NEXT_PUBLIC_SOLANA_NETWORK as TutorialProgramConfig.Network) ||
    TutorialProgramConfig.Network.TESTNET;
  const solanaApi = new SolanaApi({
    wallet: wallet as any,
    connection,
    network,
    kafeMint: new PublicKey(process.env.NEXT_PUBLIC_KAFE_MINT),
  });
  const ceramicApi = new CeramicApi({
    nodeUrl: config?.ceramicApiUrl,
  });

  const applicationFetcher = new ApplicationFetcher(solanaApi, ceramicApi);

  const tutorialProgram = useMemo(() => {
    return new TutorialProgramClient(
      connection,
      wallet as any,
      new PublicKey(process.env.NEXT_PUBLIC_KAFE_MINT),
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
