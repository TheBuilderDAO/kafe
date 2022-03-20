import React from 'react';
import CancelVoteButton from './CancelVoteButton';
import CastVoteButton from './CastVoteButton';
import { useGetVote } from '@builderdao-sdk/dao-program';
import { useDapp } from '../../hooks/useDapp';

type VoteButtonProps = {
  id: number;
  variant: string;
};

const VoteButton = (props: VoteButtonProps) => {
  const { id, variant } = props;

  const { wallet } = useDapp();
  const { vote, loading, error } = useGetVote(id, wallet.publicKey);

  if (loading) {
    return <div>...</div>;
  }

  return (
    <div>
      {vote && !error ? (
        <CancelVoteButton key="cast-vote-btn" id={id} variant={variant} />
      ) : (
        <CastVoteButton key="cancel-vote-btn" id={id} variant={variant} />
      )}
    </div>
  );
};

export default VoteButton;
