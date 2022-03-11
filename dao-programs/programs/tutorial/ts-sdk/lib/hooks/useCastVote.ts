import routes from '../routes';
import { useCallback, useState } from 'react';
import { mutate } from 'swr';
import { useTutorialProgram } from './index';

export const useCastVote = (): [
  (tutorialId: number) => Promise<void>,
  {
    submitting: boolean;
    error: Error | null;
  },
] => {
  const tutorialProgram = useTutorialProgram();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleAction = useCallback(
    async (tutorialId: number) => {
      try {
        setError(null);
        setSubmitting(true);

        await tutorialProgram?.castVote(tutorialId);

        mutate(routes.listOfVoters(tutorialId));
        mutate(
          routes.vote(
            tutorialId,
            tutorialProgram?.provider?.wallet?.publicKey!,
          ),
        );
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
