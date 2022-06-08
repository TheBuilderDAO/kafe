import useSWR from 'swr';
import { web3 } from '@project-serum/anchor';
import routes from '../routes';
import { useTutorialProgram } from './useTutorialProgram';

export const useGetReviewer = (publicKey: web3.PublicKey) => {
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
