import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './useTutorialProgram';

export const useGetListOfProposals = () => {
  const tutorialProgram = useTutorialProgram();

  const { data, error } = useSWR(routes.proposal, async () =>
    tutorialProgram?.getProposals(),
  );
  return {
    proposals: data,
    loading: !error && !data,
    error,
  };
};
