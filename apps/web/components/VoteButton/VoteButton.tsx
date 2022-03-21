import React from 'react';
import CancelVoteButton from './CancelVoteButton';
import CastVoteButton from './CastVoteButton';
import { useGetVote } from '@builderdao-sdk/dao-program';
import { useDapp } from '../../hooks/useDapp';
import Loader from '@app/components/Loader/Loader';

type VoteButtonProps = {
  id: number;
  variant?: string;
};

const VoteButton = (props: VoteButtonProps) => {
  const { id, variant } = props;

  const { wallet } = useDapp();
  const { vote, loading, error } = useGetVote(id, wallet.publicKey);

  if (loading) {
    return <Loader />;
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
