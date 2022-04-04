import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';

export const useGetHashmapTipperAccountListByIds = <D>(
  tutorialIds: number[],
) => {
  const tutorialProgram = useTutorialProgram();

  const { data, error } = useSWR(
    routes.listOfTippersByIds(tutorialIds),
    async () => tutorialProgram?.getTipperAccountListHashmapByIds(tutorialIds),
  );

  return {
    tippers: data,
    loading: !error && !data,
    error,
  };
};
