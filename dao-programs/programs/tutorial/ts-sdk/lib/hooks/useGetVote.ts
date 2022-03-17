import useSWR from 'swr';
import routes from '../routes';
import { PublicKey } from '@solana/web3.js';
import { useTutorialProgram } from './index';

export const useGetVote = <D>(slug: string, publicKey: PublicKey) => {
  const tutorialProgram = useTutorialProgram();

  const { data, error } = useSWR(routes.vote(slug, publicKey), async () =>
    tutorialProgram?.getVote(slug, publicKey),
  );

  return {
    vote: data,
    loading: !error && !data,
    error,
  };
};
