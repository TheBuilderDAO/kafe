import React from 'react';
import CancelVoteButton from './CancelVoteButton';
import CastVoteButton from './CastVoteButton';
import { ProposalStateE, useGetVote } from '@builderdao-sdk/dao-program';
import { useDapp } from '../../hooks/useDapp';
import Loader from '@app/components/Loader/Loader';

type VoteButtonProps = {
  id: number;
  currentState: ProposalStateE;
  variant?: string;
};

const VoteButton = (props: VoteButtonProps) => {
  const { id, currentState, variant } = props;

  const { wallet } = useDapp();
  const { vote, loading, error } = useGetVote(id, wallet.publicKey);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="py-2">
      {vote && Object.keys(vote).length && !error ? (
        <CancelVoteButton
          key="cast-vote-btn"
          id={id}
          variant={variant}
          disable={currentState === ProposalStateE.funded}
        />
      ) : (
        <CastVoteButton key="cancel-vote-btn" id={id} variant={variant} />
      )}
    </div>
  );
};

export default VoteButton;
