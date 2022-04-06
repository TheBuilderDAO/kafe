import useApiCall from './useApiCall';
import routes from '../routes';
import { useCallback, useState } from 'react';
import {
  ProposalStateE,
  useCastVote as solanaUseCastVote,
  useGetDaoState,
  useTutorialProgram,
} from '@builderdao-sdk/dao-program';

type IndexVotesData = {
  id: number;
  numberOfVotes: number;
  state?: ProposalStateE;
};

export const useCastVote = (): [
  (tutorialId: number) => Promise<void>,
  {
    submitting: boolean;
    error: Error;
  },
] => {
  const tutorialProgram = useTutorialProgram();
  const { daoState } = useGetDaoState();
  const [castVote] = solanaUseCastVote();
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

        await castVote(tutorialId);

        const newNumberOfVotes = currentVotes.length + 1;
        const partialIndexData: IndexVotesData = {
          id: tutorialId,
          numberOfVotes: newNumberOfVotes,
        };

        if (newNumberOfVotes >= daoState.quorum.toNumber()) {
          partialIndexData.state = ProposalStateE.funded;
        }

        await updateTutorialIndex({
          data: partialIndexData,
        });
      } catch (err) {
        console.log('Err:', err);
        setError(err);
        throw new err();
      } finally {
        setSubmitting(false);
      }
    },
    [castVote, daoState.quorum, tutorialProgram, updateTutorialIndex],
  );

  return [handleAction, { submitting, error }];
};
