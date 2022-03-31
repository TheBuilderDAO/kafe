import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';

export const useGetListOfTippers = <D>() => {
  const tutorialProgram = useTutorialProgram();

  const { data, error } = useSWR(routes.listOfTippers, async () =>
    tutorialProgram?.getListOfTippers(),
  );

  return {
    tippers: data,
    loading: !error && !data,
    error,
  };
};
