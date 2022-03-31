import useApiCall from './useApiCall';
import routes from '../routes';
import { useCallback, useState } from 'react';
import { useCancelVote as solanaUseCancelVote } from '@builderdao-sdk/dao-program';

type IndexVotesData = {
  id: number;
  numberOfVotes: number;
};

export const useCancelVote = (
  currentVotes,
): [
  (tutorialId: number) => Promise<void>,
  {
    submitting: boolean;
    error: Error;
  },
] => {
  const [cancelVote] = solanaUseCancelVote();
  const [updateTutorialIndex] = useApiCall<IndexVotesData, any>(
    routes.api.algolia.updateTutorial,
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleAction = useCallback(
    async (tutorialId: number) => {
      try {
        setError(null);
        setSubmitting(true);

        await cancelVote(tutorialId);

        await updateTutorialIndex({
          data: { id: tutorialId, numberOfVotes: currentVotes.length - 1 },
        });
      } catch (err) {
        console.log('Err:', err);
        setError(err);
        throw new err();
      } finally {
        setSubmitting(false);
      }
    },
    [cancelVote, updateTutorialIndex, currentVotes.length],
  );

  return [handleAction, { submitting, error }];
};
