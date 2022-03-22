import React from 'react';
import { addEllipsis } from '../../utils/strings';
import VoteButton from '../VoteButton/VoteButton';
import {
  ProposalStateE,
  useGetDaoState,
  useGetListOfTippersById,
  useGetListOfVoters,
} from '@builderdao-sdk/dao-program';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import TipTutorialForm from '@app/components/TipTutorialForm/TipTutorialForm';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Loader from '@app/components/Loader/Loader';
import UserAvatar from '../UserAvatar/UserAvatar';

type TutorialTipsProps = {
  id: number;
};

const TutorialTips = (props: TutorialTipsProps) => {
  const { id } = props;

  const { tippers, loading, error } = useGetListOfTippersById(id);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error occurred</div>;
  }

  return (
    <div className="text-kafeblack dark:text-kafewhite w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-larken text-xl">
          {tippers.length} {tippers.length !== 1 ? 'supporters' : 'supporter'}
        </h3>
        <small>view all</small>
      </div>
      <ul>
        {tippers.map((tipperAccount, index) => (
          <li
            className="py-4 dark:text-kafewhite text-xs text-kafeblack flex items-center justify-between"
            key={tipperAccount.account.pubkey.toString()}
          >
            <UserAvatar address={tipperAccount.account.pubkey.toString()} />
            <p className="font-space-italic">
              {tipperAccount.account.amount.toNumber() / LAMPORTS_PER_SOL} SOL
            </p>
          </li>
        ))}
      </ul>

      <IsLoggedIn>
        <div className="mt-6">
          <TipTutorialForm id={id} />
        </div>
      </IsLoggedIn>
    </div>
  );
};

export default TutorialTips;
