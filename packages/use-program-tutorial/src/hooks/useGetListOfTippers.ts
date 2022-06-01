import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './useTutorialProgram';

export const useGetListOfTippers = () => {
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
