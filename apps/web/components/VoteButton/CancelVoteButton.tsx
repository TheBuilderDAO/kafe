import React, { useCallback } from 'react';
import { useCancelVote } from '../../hooks/useCancelVote';
import { useGetListOfVoters } from '@builderdao-sdk/dao-program';
import toast from 'react-hot-toast';

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
      })

    } catch (err) {
      toast.error(err.message);
    }
  }, [id, cancelVote]);

  return (
    <div>
      <button
        disabled={submitting}
        className="items-center w-full px-4 py-2 mt-4 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        onClick={handleClick}
      >
        {submitting ? 'Submitting...' : 'cancel vote'}
      </button>
    </div>
  );
};

export default CancelVoteButton;
