import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';

export const useGetListOfVoters = <D>(tutorialId: number) => {
  const tutorialProgram = useTutorialProgram();
  const { data, error } = useSWR(
    tutorialProgram ? routes.listOfVoters(tutorialId) : null,
    async () => tutorialProgram?.getListOfVoters(tutorialId),
  );

  return {
    voters: data,
    loading: !error && !data,
    error,
  };
};
