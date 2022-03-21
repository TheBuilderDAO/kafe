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
    <div className="text-black">
      <h3 className="dark:text-white">
        Supporters <small>{tippers.length} supporters</small>
      </h3>
      <ul>
        {tippers.map((tipperAccount, index) => (
          <li
            className="py-4 dark:text-white"
            key={tipperAccount.account.pubkey.toString()}
          >
            {index + 1}. {addEllipsis(tipperAccount.account.pubkey.toString())}{' '}
            {tipperAccount.account.amount.toNumber() / LAMPORTS_PER_SOL}
          </li>
        ))}
      </ul>

      <IsLoggedIn>
        <div className="mt-6">
          <p className="dark:text-white">Support Project</p>
          <TipTutorialForm id={id} />
        </div>
      </IsLoggedIn>
    </div>
  );
};

export default TutorialTips;
