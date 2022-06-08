import { ReviewerAccount, AccountResult } from '@builderdao/program-tutorial';
import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './useTutorialProgram';

type ReviewersMap = {
  [publicKey: string]: ReviewerAccount;
};
export const useGetListOfReviewers = () => {
  const tutorialProgram = useTutorialProgram();

  const { data, error, ...otherProps } = useSWR(
    routes.listOfReviewers,
    async () => tutorialProgram.getReviewers(),
  );

  return {
    reviewers: data,
    reviewersMap: data?.reduce(
      (prev: ReviewersMap, curr: AccountResult<ReviewerAccount>) => {
        prev[curr.publicKey.toString()] = curr.account;
        return prev;
      },
      {} as ReviewersMap,
    ),
    loading: !error && !data,
    error,
    ...otherProps,
  };
};
