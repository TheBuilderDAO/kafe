import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';

export const useGetListOfVoters = <D>(slug: string) => {
  const tutorialProgram = useTutorialProgram();
  const { data, error } = useSWR(
    tutorialProgram ? routes.listOfVoters(slug) : null,
    async () => tutorialProgram?.getListOfVoters(slug),
  );

  return {
    voters: data,
    loading: !error && !data,
    error,
  };
};
