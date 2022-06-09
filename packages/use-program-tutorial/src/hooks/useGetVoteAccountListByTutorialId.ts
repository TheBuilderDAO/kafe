import { AccountResult, VoteAccount } from '@builderdao/program-tutorial';
import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './useTutorialProgram';

export const useGetListOfVotersById = (tutorialId: number) => {
  const tutorialProgram = useTutorialProgram();
  const { data, error } = useSWR(
    tutorialProgram ? routes.listOfVotersById(tutorialId) : null,
    async () => tutorialProgram?.getVoteAccountListByTutorialId(tutorialId),
  );

  return {
    voters: data as AccountResult<VoteAccount>[],
    loading: !error && !data,
    error,
  };
};
