import { useCallback, useState } from 'react';
import { useDapp } from './useDapp';
import useApiCall from './useApiCall';
import routes from '../routes';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import {
  useGuideTipping,
} from '@builderdao-sdk/dao-program';

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

        await updateTutorialIndex({
          data: {
            id: data.id.toString(),
            totalTips: 0,
          },
        });
      } catch (err) {
        console.log('ERR:', err);
        setError(err);
        throw new err();
      } finally {
        setSubmitting(false);
      }
    },
    [publicKey, tipTutorial, updateTutorialIndex],
  );

  return [handleAction, { submitting, error }];
};
