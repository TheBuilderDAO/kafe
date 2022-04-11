import { useCallback, useState } from 'react';
import { useDapp } from './useDapp';
import useApiCall from './useApiCall';
import routes from '../routes';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import {
  useGuideTipping,
  useTutorialProgram,
} from '@builderdao/program-tutorial';

export const useTipTutorial = <AD>(): [
  (data: AD) => Promise<void>,
  {
    submitting: boolean;
    error: Error;
  },
] => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState(null);

  const {
    wallet: { publicKey },
  } = useDapp();
  const tutorialProgram = useTutorialProgram();
  const [tipTutorial] = useGuideTipping();
  const [updateTutorialIndex] = useApiCall<any, any>(
    routes.api.algolia.updateTutorial,
  );

  const handleAction = useCallback(
    async data => {
      if (!publicKey) throw new WalletNotConnectedError();

      try {
        setError(null);
        setSubmitting(true);

        const txHash = await tipTutorial({
          id: data.id,
          tipperPk: publicKey,
          amount: data.amount,
        });

        console.log('TX Hash', txHash);

        const currentTotalTips = await tutorialProgram.getTotalTipsById(
          data.id,
        );

        await updateTutorialIndex({
          data: {
            id: data.id.toString(),
            totalTips: currentTotalTips.toNumber() + data.amount,
          },
        });
      } catch (err) {
        console.log('ERR:', err);
        setError(err);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [publicKey, tipTutorial, tutorialProgram, updateTutorialIndex],
  );

  return [handleAction, { submitting, error }];
};
