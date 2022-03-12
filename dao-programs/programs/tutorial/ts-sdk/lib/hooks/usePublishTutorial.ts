import { useCallback, useState } from 'react';
import routes from '../routes';
import { mutate } from 'swr';
import { useTutorialProgram } from './index';

export const usePublishTutorial = <AD>(): [
  (data: AD) => Promise<string | undefined>,
  {
    submitting: boolean;
    error: Error | null;
  },
] => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const tutorialProgram = useTutorialProgram();

  const handleAction = useCallback(
    async data => {
      try {
        setError(null);
        setSubmitting(true);

        // const txHash = await tutorialProgram.publishProposal(data);
        const txHash = "TODO:";

        console.log('TX Hash', txHash);

        mutate(routes.daoState);

        return txHash;
      } catch (err) {
        if (err instanceof Error) {
          console.log('Err:', err);
          setError(err);
        }

        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [tutorialProgram],
  );

  return [handleAction, { submitting, error }];
};
