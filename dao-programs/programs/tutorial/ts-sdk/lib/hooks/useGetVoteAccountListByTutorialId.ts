import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';

export const useGetListOfVotersById = <D>(tutorialId: number) => {
  const tutorialProgram = useTutorialProgram();
  const { data, error } = useSWR(
    tutorialProgram ? routes.listOfVotersById(tutorialId) : null,
    async () => tutorialProgram?.getVoteAccountListByTutorialId(tutorialId),
  );

  return {
    voters: data,
    loading: !error && !data,
    error,
  };
};
