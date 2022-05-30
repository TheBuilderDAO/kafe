import { TipperAccount } from '@builderdao/program-tutorial';
import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './useTutorialProgram';

export const useGetHashmapTipperAccountListByIds = (
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
