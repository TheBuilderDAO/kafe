import type { AppProps } from 'next/app';
import Script from 'next/script';
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
import {
  NEXT_PUBLIC_SOLANA_NETWORK,
  NEXT_PUBLIC_SOLANA_NODE_URL,
} from '@app/constants';
import Analytics from '@app/components/Analytics/Analytics';

require('nprogress/nprogress.css');
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App = ({ Component, pageProps }: AppProps) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network =
    NEXT_PUBLIC_SOLANA_NETWORK as TutorialProgramConfig.ExtendedCluster;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    return (
      NEXT_PUBLIC_SOLANA_NODE_URL ||
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
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
          }}
        >
          <Head>
            <meta
              content="width=device-width, initial-scale=1"
              name="viewport"
            />
            <link rel="shortcut icon" href="/favicon.ico" />
          </Head>
          <Script
            id="analytics-pendo"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              (function(apiKey){
                  (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
                  v=['initialize','identify','updateOptions','pageLoad','track'];for(w=0,x=v.length;w<x;++w)(function(m){
                      o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
                      y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
                      z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
              })('${process.env.NEXT_PUBLIC_PENDO_API_KEY}');
            `,
            }}
          />
          <SWRDevTools>
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <>
                    <Analytics />
                    <DappProvider>
                      <PublicLayout>
                        <Component {...pageProps} />
                      </PublicLayout>
                    </DappProvider>
                  </>
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
