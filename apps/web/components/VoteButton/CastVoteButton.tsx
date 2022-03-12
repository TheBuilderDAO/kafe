import React, { useCallback } from 'react';

import { useCastVote } from '../../hooks/useCastVote';
import { useGetListOfVoters } from '@builderdao-sdk/dao-program';
import toast from 'react-hot-toast';
import Image from 'next/image';
import coffeeIdle from '/public/assets/icons/coffee_cup_idle.svg';

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
      });
    } catch (err) {
      toast.error(err.message);
    }
  }, [id, castVote]);

  return (
    <button
      disabled={submitting}
      className="w-24 h-24 rounded-full dark:bg-kafedarker bg-kafegold dark:hover:bg-kafewhite hover:bg-kafeblack"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center p-0 m-0">
        <Image src={coffeeIdle} width={40} height={40} alt="coffee votes" />
      </div>
    </button>
  );
};

export default CastVoteButton;
