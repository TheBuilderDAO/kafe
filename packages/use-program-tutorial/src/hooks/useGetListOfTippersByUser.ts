import * as anchor from '@project-serum/anchor';
import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './useTutorialProgram';

export const useGetListOfTippersByUser = (tipperPk: anchor.web3.PublicKey) => {
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
