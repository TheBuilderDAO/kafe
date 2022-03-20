import React, { useCallback } from 'react';
import { useCastVote } from '../../hooks/useCastVote';
import { useGetListOfVoters } from '@builderdao-sdk/dao-program';
import toast from 'react-hot-toast';
import VotedSVG from '../SVG/Coffee Icons/VotedSVG';

type CastVoteButtonProps = {
  id: number;
  variant: string;
};

const CastVoteButton = (props: CastVoteButtonProps) => {
  const { id, variant } = props;

  const { voters } = useGetListOfVoters(id);
  const [castVote, { submitting }] = useCastVote(voters);

  const handleClick = useCallback(async () => {
    try {
      const tx = castVote(id);
      toast.promise(tx, {
        loading: `Casting vote`,
        success: `Vote cast successfully`,
        error: `Error casting vote`,
      });
    } catch (err) {
      toast.error(err.message);
    }
  }, [id, castVote]);

  return (
    <button
      disabled={submitting}
      className={`${
        variant === 'standard'
          ? 'dark:bg-kafewhite bg-kafeblack w-full h-14 rounded-2xl dark:text-kafeblack text-kafewhite dark:hover:bg-kafered hover:bg-kafegold hover:text-kafeblack'
          : 'w-24 h-24 rounded-full dark:bg-kafedarker bg-kafelighter dark:hover:bg-kafelighter hover:bg-kafeblack group shadow-xl'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center p-0 m-0">
        {!variant && <VotedSVG voted={true} />}
        {variant && <p>vote</p>}
      </div>
    </button>
  );
};

export default CastVoteButton;
