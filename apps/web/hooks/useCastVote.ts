import useApiCall from './useApiCall';
import routes from '../routes';
import { useCallback, useState } from 'react';
import { useCastVote as solanaUseCastVote } from '@builderdao-sdk/dao-program';

type IndexVotesData = {
  id: number;
  newNumberOfVotes: number;
};

export const useCastVote = (
  currentVotes,
): [
  (tutorialId: number) => Promise<void>,
  {
    submitting: boolean;
    error: Error;
  },
] => {
  const [castVote] = solanaUseCastVote();
  const [updateIndex] = useApiCall<IndexVotesData, any>(
    routes.api.tutorials.updateIndexRecord,
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleAction = useCallback(
    async (tutorialId: number) => {
      try {
        setError(null);
        setSubmitting(true);

        await castVote(tutorialId);

        await updateIndex({
          data: { id: tutorialId, newNumberOfVotes: currentVotes.length + 1 },
        });
      } catch (err) {
        console.log('Err:', err);
        setError(err);
        throw new err();
      } finally {
        setSubmitting(false);
      }
    },
    [castVote, updateIndex, currentVotes.length],
  );

  return [handleAction, { submitting, error }];
};
