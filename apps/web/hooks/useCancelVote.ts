import useApiCall from './useApiCall';
import routes from '../routes';
import { useCallback, useState } from 'react';
import {
  useCancelVote as solanaUseCancelVote,
  useTutorialProgram,
} from '@builderdao-sdk/dao-program';
import { captureException } from '@app/utils/errorLogging';

type IndexVotesData = {
  id: number;
  numberOfVotes: number;
};

export const useCancelVote = (): [
  (tutorialId: number) => Promise<void>,
  {
    submitting: boolean;
    error: Error;
  },
] => {
  const tutorialProgram = useTutorialProgram();
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

        const currentVotes =
          await tutorialProgram.getVoteAccountListByTutorialId(tutorialId);

        await cancelVote(tutorialId);

        await updateTutorialIndex({
          data: { id: tutorialId, numberOfVotes: currentVotes.length - 1 },
        });
      } catch (err) {
        console.log('Err:', err);
        captureException(err);
        setError(err);
        throw new err();
      } finally {
        setSubmitting(false);
      }
    },
    [tutorialProgram, cancelVote, updateTutorialIndex],
  );

  return [handleAction, { submitting, error }];
};
