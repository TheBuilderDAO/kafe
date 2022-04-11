import { VoteAccount } from '@builderdao/program-tutorial';
import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';

export const useGetHashmapVoterAccountListByIds = <D>(
  tutorialIds: number[],
) => {
  const tutorialProgram = useTutorialProgram();
  const { data, error } = useSWR(
    tutorialProgram ? routes.listOfVotersByIds(tutorialIds) : null,
    async () =>
      tutorialProgram?.getVoteAccountListHashmapByTutorialIds(tutorialIds),
  );

  return {
    voters: data as { [tutorialAccountId: string]: VoteAccount },
    loading: !error && !data,
    error,
  };
};
