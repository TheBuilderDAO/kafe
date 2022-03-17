import routes from '../routes';
import { useCallback, useState } from 'react';
import { mutate } from 'swr';
import { useTutorialProgram } from './index';

export const useCastVote = (): [
  (slug: string) => Promise<void>,
  {
    submitting: boolean;
    error: Error | null;
  },
] => {
  const tutorialProgram = useTutorialProgram();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleAction = useCallback(
    async (slug: string) => {
      try {
        setError(null);
        setSubmitting(true);

        await tutorialProgram?.castVote(slug);

        mutate(routes.listOfVoters(slug));
        mutate(
          routes.vote(slug, tutorialProgram?.provider?.wallet?.publicKey!),
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
