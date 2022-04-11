import { ReviewerAccount, AccountResult } from '@builderdao/program-tutorial';
import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';

type reviewersMap = {
  [publicKey: string]: ReviewerAccount
}
export const useGetListOfReviewers = <D>() => {
  const tutorialProgram = useTutorialProgram();

  const { data, error, ...otherProps } = useSWR(
    routes.listOfReviewers,
    async () => tutorialProgram.getReviewers(),
  );

  return {
    reviewers: data,
    reviewersMap: data?.reduce((prev: reviewersMap, curr: AccountResult<ReviewerAccount>) => {
      prev[curr.publicKey.toString()] = curr.account;
      return prev;
    }, {} as reviewersMap),
    loading: !error && !data,
    error,
    ...otherProps,
  };
};
