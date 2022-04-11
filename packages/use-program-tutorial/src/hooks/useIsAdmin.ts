import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';
import { useWallet } from '@solana/wallet-adapter-react';

export const useIsAdmin = <D>() => {
  const wallet = useWallet();
  const tutorialProgram = useTutorialProgram();

  const { data, error } = useSWR(
    wallet.connected ? routes.admin : null,
    async () => tutorialProgram?.getIsAdmin(),
  );

  return {
    isAdmin: data,
    loading: !error && data == undefined,
    error,
  };
};
