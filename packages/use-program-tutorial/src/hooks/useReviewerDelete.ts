import { useCallback, useState } from 'react';
import { mutate } from 'swr';
import * as anchor from '@project-serum/anchor';
import { useTutorialProgram } from './useTutorialProgram';
import routes from '../routes';

type ActionData = {
  authorityPk: anchor.web3.PublicKey;
  reviewerPk: anchor.web3.PublicKey;
};

export const useReviewerDelete = (): [
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

        await tutorialProgram.deleteReviewer(data);

        mutate(routes.listOfReviewers);
        mutate(routes.reviewer(data.reviewerPk));
      } catch (err) {
        if (err instanceof Error) {
          console.log('ERR:', err);
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
