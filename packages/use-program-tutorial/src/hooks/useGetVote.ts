import useSWR from 'swr';
import * as anchor from '@project-serum/anchor';
import routes from '../routes';
import { useTutorialProgram } from './useTutorialProgram';

export const useGetVote = (tutorialId: number, publicKey: anchor.web3.PublicKey) => {
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
