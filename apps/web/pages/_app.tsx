import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { SWRDevTools } from 'swr-devtools';
import { ThemeProvider } from 'next-themes';

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import { fetcherWithConfig } from '../utils/fetcher';
import PublicLayout from '../layouts/PublicLayout/PublicLayout';
import React, { useMemo } from 'react';
import { DappProvider } from '../hooks/useDapp';
import { TutorialProgramConfig } from '@builderdao-sdk/dao-program';

require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App = ({ Component, pageProps }: AppProps) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = process.env
    .NEXT_PUBLIC_SOLANA_NETWORK as TutorialProgramConfig.ExtendedCluster;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_SOLANA_NODE_URL ||
      TutorialProgramConfig.getClusterUrl(network)
    );
  }, [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network],
  );

  return (
    <>
      <ThemeProvider attribute="class">
        <SWRConfig
          value={{
            fallback: pageProps?.fallback || {},
            fetcher: fetcherWithConfig,
          }}
        >
          <Head>
            <meta
              content="width=device-width, initial-scale=1"
              name="viewport"
            />
            <link rel="shortcut icon" href="/favicon.ico" />
          </Head>
          {/* TODO: <Analytics /> */}
          <SWRDevTools>
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <DappProvider>
                    <PublicLayout>
                      <Component {...pageProps} />
                    </PublicLayout>
                  </DappProvider>
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          </SWRDevTools>
        </SWRConfig>
      </ThemeProvider>
    </>
  );
};

export default App;
