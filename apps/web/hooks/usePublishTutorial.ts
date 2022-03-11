import { useCallback, useState } from 'react';
import { useDapp } from './useDapp';
import useApiCall from './useApiCall';
import routes from '../routes';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { usePublishTutorial as solanaUsePublishTutorial } from '@builderdao-sdk/dao-program';

export const usePublishTutorial = (): [
  (tutorialId: number) => Promise<void>,
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

  const [publishTutorial] = solanaUsePublishTutorial();
  const [triggerWorkflow] = useApiCall<any, any>(
    routes.api.tutorials.triggerWorkflow,
  );

  const handleAction = useCallback(
    async (tutorialId: number) => {
      if (!publicKey) throw new WalletNotConnectedError();

      try {
        setError(null);
        setSubmitting(true);

        await triggerWorkflow();

        // Update tutorial in Solana program
        const txHash = await publishTutorial({
          id: tutorialId,
          creatorPk: publicKey,
        });

        console.log('TX Hash', txHash);
      } catch (err) {
        console.log('ERR:', err);
        setError(err);
        throw new err();
      } finally {
        setSubmitting(false);
      }
    },
    [publicKey, publishTutorial, triggerWorkflow],
  );

  return [handleAction, { submitting, error }];
};
