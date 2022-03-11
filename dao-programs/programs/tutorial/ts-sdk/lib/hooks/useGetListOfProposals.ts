import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';

export const useGetListOfProposals = <D>() => {
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
