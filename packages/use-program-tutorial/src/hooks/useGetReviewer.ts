import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';
import { PublicKey } from '@solana/web3.js';

export const useGetReviewer = <D>(publicKey: PublicKey) => {
  const tutorialProgram = useTutorialProgram();

  const { data, error } = useSWR(routes.reviewer(publicKey), async () =>
    tutorialProgram.getReviewerByReviewerPk(publicKey),
  );

  return {
    reviewer: data,
    loading: !error && !data,
    error,
  };
};
