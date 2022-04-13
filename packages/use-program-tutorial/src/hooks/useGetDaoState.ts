import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './useTutorialProgram';

export const useGetDaoState = () => {
  const tutorialProgram = useTutorialProgram();

  const { data, error } = useSWR(
    tutorialProgram ? routes.daoState : null,
    async () => tutorialProgram?.getDaoAccount(),
  );

  return {
    daoState: data,
    loading: !error && !data,
    error,
  };
};
