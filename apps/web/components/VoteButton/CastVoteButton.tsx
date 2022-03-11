import React, { useCallback } from 'react';

import { useCastVote } from '../../hooks/useCastVote';
import { useGetListOfVoters } from '@builderdao-sdk/dao-program';
import toast from 'react-hot-toast';

type CastVoteButtonProps = {
  id: number;
};

const CastVoteButton = (props: CastVoteButtonProps) => {
  const { id } = props;

  const { voters } = useGetListOfVoters(id);
  const [castVote, { submitting }] = useCastVote(voters);

  const handleClick = useCallback(async () => {
    try {
      const tx = castVote(id);
      toast.promise(tx, {
        loading: `Casting vote`,
        success: `Vote cast successfully`,
        error: `Error casting vote`,
      })
    } catch (err) {
      toast.error(err.message);
    }
  }, [id, castVote]);

  return (
    <button
      disabled={submitting}
      className="items-center w-full px-4 py-2 mt-4 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
      onClick={handleClick}
    >
      {submitting ? 'Submitting...' : 'up vote'}
    </button>
  );
};

export default CastVoteButton;
