import { PublicKey } from '@solana/web3.js';
import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';

export const useGetListOfTippersByUser = <D>(tipperPk: PublicKey) => {
  const tutorialProgram = useTutorialProgram();

  const { data, error } = useSWR(
    routes.listOfTippersByUser(tipperPk),
    async () => tutorialProgram?.getListOfTippersByUser(tipperPk),
  );

  return {
    tippers: data,
    loading: !error && !data,
    error,
  };
};
