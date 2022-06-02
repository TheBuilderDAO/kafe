import React, { useCallback } from 'react';
import { useCancelVote } from '../../hooks/useCancelVote';
import toast from 'react-hot-toast';
import Image from 'next/image';
import votedIcon from 'public/assets/icons/voted.png';
import ReactTooltip from 'react-tooltip';
import { useTheme } from 'next-themes';
import Tooltip from '@app/components/Tooltip/Tooltip';

type CancelVoteButtonProps = {
  id: number;
  variant: string;
  disable?: boolean;
};

const CancelVoteButton = (props: CancelVoteButtonProps) => {
  const { id, variant, disable = false } = props;
  const { theme } = useTheme();
  const [cancelVote, { submitting }] = useCancelVote();

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

  console.log('Theme', theme);

  return (
    <div>
      <button
        disabled={submitting || disable}
        className={`${
          variant === 'standard'
            ? 'border-[1px] border-kafeblack dark:border-kafewhite bg-kafelighter dark:bg-kafedarker w-full h-14 rounded-2xl dark:text-kafewhite text-kafeblack'
            : 'w-[52px] h-[52px] rounded-full dark:bg-kafedarker bg-kafelighter dark:hover:bg-kafelighter hover:bg-kafeblack group cursor-pointer'
        }`}
        onClick={handleClick}
        data-for="main"
        data-tip="Cancel vote"
        data-iscapture="true"
      >
        <div className="flex items-center justify-center">
          {!variant && (
            <Image src={votedIcon} width={25} height={25} alt="voted" />
          )}
          {variant && <p>voted</p>}
        </div>
      </button>
      <Tooltip id="main" effect="solid" />
    </div>
  );
};

export default CancelVoteButton;
