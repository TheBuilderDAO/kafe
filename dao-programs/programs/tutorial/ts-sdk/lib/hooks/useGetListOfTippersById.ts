import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';

export const useGetListOfTippersById = <D>(id: number) => {
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
