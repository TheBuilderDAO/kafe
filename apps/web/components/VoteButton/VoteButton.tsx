import React from 'react';
import CancelVoteButton from './CancelVoteButton';
import CastVoteButton from './CastVoteButton';
import { useGetVote } from '@builderdao-sdk/dao-program';
import { useDapp } from '../../hooks/useDapp';

type VoteButtonProps = {
  id: number;
};

const VoteButton = (props: VoteButtonProps) => {
  const { id } = props;

  const { wallet } = useDapp();
  const { vote, loading, error } = useGetVote(id, wallet.publicKey);

  if (loading) {
    return <div>...</div>;
  }

  return (
    <div>
      {vote && !error ? (
        <CancelVoteButton key="cast-vote-btn" id={id} />
      ) : (
        <CastVoteButton key="cancel-vote-btn" id={id} />
      )}
    </div>
  );
};

export default VoteButton;
