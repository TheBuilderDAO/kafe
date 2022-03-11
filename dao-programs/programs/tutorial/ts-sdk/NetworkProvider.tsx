import { Network } from '@builderdao/dao-utils';
import { FC, ReactNode } from 'react';
import { NetworkContext } from './useNetwork';

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
