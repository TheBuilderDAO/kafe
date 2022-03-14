import React, { useCallback } from 'react';
import { useCancelVote } from '../../hooks/useCancelVote';
import { useGetListOfVoters } from '@builderdao-sdk/dao-program';
import toast from 'react-hot-toast';
import VotedSVG from '../SVG/Coffee Icons/VotedSVG';

type CancelVoteButtonProps = {
  id: number;
};

const CancelVoteButton = (props: CancelVoteButtonProps) => {
  const { id } = props;

  const { voters } = useGetListOfVoters(id);

  const [cancelVote, { submitting }] = useCancelVote(voters);

  const handleClick = useCallback(async () => {
    try {
      const tx = cancelVote(id);

      toast.promise(tx, {
        loading: `Cancelling vote`,
        success: `Vote cancelled successfully`,
        error: `Error cancelling vote`,
      });
    } catch (err) {
      toast.error(err.message);
    }
  }, [id, cancelVote]);

  return (
    <div>
      <button
        disabled={submitting}
        className="w-24 h-24 rounded-full dark:bg-kafedarker bg-kafelighter dark:hover:bg-kafelighter hover:bg-kafeblack group shadow-xl"
        onClick={handleClick}
      >
        <div className="flex items-center justify-center p-0 m-0">
          <VotedSVG voted={false} />
        </div>
      </button>
    </div>
  );
};

export default CancelVoteButton;
