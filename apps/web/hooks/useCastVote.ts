import useApiCall from './useApiCall';
import routes from '../routes';
import { useCallback, useState } from 'react';
import {
  ProposalStateE,
  useCastVote as solanaUseCastVote,
  useGetDaoState,
  useTutorialProgram,
} from '@builderdao/use-program-tutorial';
import { trackEvent } from '../utils/analytics';
import { EventType, VotedEventProps } from '../utils/analytics/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { captureException } from '@app/utils/errorLogging';

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
  const wallet = useWallet();
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

        trackEvent<VotedEventProps>(EventType.VOTED, {
          tutorialId,
          publicKey: wallet.publicKey.toString(),
        });
      } catch (err) {
        console.log('ERR:', err);
        captureException(err);
        setError(err);
        throw new err();
      } finally {
        setSubmitting(false);
      }
    },
    [
      castVote,
      daoState.quorum,
      tutorialProgram,
      updateTutorialIndex,
      wallet.publicKey,
    ],
  );

  return [handleAction, { submitting, error }];
};
