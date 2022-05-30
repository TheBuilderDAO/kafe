import { useCallback, useState } from 'react';
import { mutate } from 'swr';
import { BN } from '@project-serum/anchor';
import { useTutorialProgram } from './useTutorialProgram';
import routes from '../routes';

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

        const newVote = {
          author: tutorialProgram.provider.wallet.publicKey,
          tutorialId: new BN(tutorialId),
        };

        mutate(routes.tutorialById(tutorialId));
        mutate(
          routes.listOfVotersById(tutorialId),
          async (voters: any) => [
            ...voters,
            {
              account: newVote,
            },
          ],
          {
            revalidate: false,
            populateCache: true,
            rollbackOnError: true,
          },
        );
        mutate(
          routes.vote(
            tutorialId,
            tutorialProgram?.provider?.wallet?.publicKey!,
          ),
          async (vote: any) => newVote,
          {
            revalidate: false,
            populateCache: true,
            rollbackOnError: true,
          },
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
