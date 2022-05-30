import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './useTutorialProgram';

export const useGetListOfTippersById = (id: number) => {
  const tutorialProgram = useTutorialProgram();

  const { data, error } = useSWR(routes.listOfTippersById(id), async () =>
    tutorialProgram?.getListOfTippersById(id),
  );

  return {
    tippers: data,
    loading: !error && !data,
    error,
  };
};
