import useSWR from 'swr';
import routes from '../routes';
import { PublicKey } from '@solana/web3.js';
import { useTutorialProgram } from './index';

export const useGetVote = <D>(tutorialId: number, publicKey: PublicKey) => {
  const tutorialProgram = useTutorialProgram();

  const { data, error } = useSWR(routes.vote(tutorialId, publicKey), async () =>
    tutorialProgram?.getVote(tutorialId, publicKey),
  );

  return {
    vote: data,
    loading: !error && !data,
    error,
  };
};
