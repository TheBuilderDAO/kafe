import { FC, ReactNode } from 'react';
import { NetworkContext } from './useNetwork';

export enum Network {
  MAINNET = 'mainnet-beta',
  DEVNET = 'devnet',
  TESTNET = 'testnet',
  LOCALNET = 'localnet',
}

export interface NetworkProviderProps {
  children: ReactNode;
  network: Network;
}

export const ConnectionProvider: FC<NetworkProviderProps> = ({
  children,
  network,
}) => (
  <NetworkContext.Provider value={{ network }}>
    {children}
  </NetworkContext.Provider>
);
