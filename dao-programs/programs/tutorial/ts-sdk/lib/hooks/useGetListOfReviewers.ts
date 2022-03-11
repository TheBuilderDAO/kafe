import { IdlAccounts, Program } from '@project-serum/anchor';
import useSWR from 'swr';
import { Tutorial } from '../idl/tutorial';
import routes from '../routes';
import { useTutorialProgram } from './index';

type reviewersMap = {
  [publicKey: string]: IdlAccounts<Tutorial>["reviewerAccount"]
}
export const useGetListOfReviewers = <D>() => {
  const tutorialProgram = useTutorialProgram();

  const { data, error, ...otherProps } = useSWR(
    routes.listOfReviewers,
    async () => tutorialProgram.getReviewers(),
  );

  return {
    reviewers: data,
    reviewersMap: data?.reduce((prev, curr) => {
      prev[curr.publicKey.toString()] = curr.account;
      return prev;
    }, {} as reviewersMap),
    loading: !error && !data,
    error,
    ...otherProps,
  };
};
