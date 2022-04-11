import { TipperAccount } from '@builderdao/program-tutorial';
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
    tippers: data as { [tutorialAccountId: string]: TipperAccount },
    loading: !error && !data,
    error,
  };
};
