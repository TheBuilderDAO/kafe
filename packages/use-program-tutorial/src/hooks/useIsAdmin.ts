import useSWR from 'swr';
import { useWallet } from '@solana/wallet-adapter-react';
import routes from '../routes';
import { useTutorialProgram } from './useTutorialProgram';

export const useIsAdmin = () => {
  const wallet = useWallet();
  const tutorialProgram = useTutorialProgram();

  const { data, error } = useSWR(
    wallet.connected ? routes.admin : null,
    async () => tutorialProgram?.getIsAdmin(),
  );

  return {
    isAdmin: data,
    loading: !error && data === undefined,
    error,
  };
};
