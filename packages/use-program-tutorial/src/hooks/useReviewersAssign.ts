import { useCallback, useState } from 'react';
import { mutate } from 'swr';
import * as anchor from '@project-serum/anchor';
import { useTutorialProgram } from './useTutorialProgram';
import routes from '../routes';

type ActionData = {
  id: number;
  authorityPk: anchor.web3.PublicKey;
  reviewerPks: anchor.web3.PublicKey[];
};

export const useReviewersAssign = (): [
  (data: ActionData) => Promise<void>,
  {
    submitting: boolean;
    error: Error | null;
  },
] => {
  const tutorialProgram = useTutorialProgram();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleAction = useCallback(
    async (data: ActionData) => {
      try {
        setError(null);
        setSubmitting(true);

        await tutorialProgram.assignReviewer(data);

        mutate(routes.tutorialById(data.id));
      } catch (err) {
        if (err instanceof Error) {
          console.error('Err:', err);
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
