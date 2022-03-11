import { Network } from '@builderdao/dao-utils';
import { createContext, useContext } from 'react';

export interface NetworkContextState {
  network: Network;
}

export const NetworkContext = createContext<NetworkContextState>(
  {} as NetworkContextState,
);

export function useNetwork(): NetworkContextState {
  return useContext(NetworkContext);
}
