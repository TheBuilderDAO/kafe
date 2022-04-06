import React, { useState, useEffect } from 'react';
import VoteButton from '../VoteButton/VoteButton';
import {
  ProposalStateE,
  useGetDaoState,
  useGetListOfVotersById,
} from '@builderdao-sdk/dao-program';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import UserAvatar from '../UserAvatar/UserAvatar';
import Loader from '@app/components/Loader/Loader';
import LoginButton from '@app/components/LoginButton/LoginButton';
import { useDapp } from '../../hooks/useDapp';
import VotedSVG from '@app/components/SVG/Coffee Icons/VotedSVG';
import CastVoteButton from '@app/components/VoteButton/CastVoteButton';

type TutorialProposalVotesProps = {
  id: number;
  state: ProposalStateE;
};

const TutorialProposalVotes = (props: TutorialProposalVotesProps) => {
  const { id, state } = props;
  const { wallet } = useDapp();
  const [voteFull, setVoteFull] = useState(false);
  const [remainder, setRemainder] = useState(0);

  const { daoState, loading, error } = useGetDaoState();
  const {
    voters,
    loading: listLoading,
    error: listError,
  } = useGetListOfVotersById(id);

  useEffect(() => {
    if (voters && daoState) {
      setVoteFull(voters.length >= Number(daoState.quorum));
      setRemainder(Number(daoState.quorum) - voters.length);
    }
  }, [voters, daoState]);

  if (loading || listLoading) {
    return <Loader />;
  }

  if (error || listError) {
    return <div>Error occurred</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-2xl font-larken">Voters </p>
        <div className="flex-row justify-between">
          <small className="text-xs font-space">
            <span>{voters.length}</span>
            <span className="text-kafemellow">
              /{daoState.quorum.toString()} votes
            </span>
          </small>
        </div>
      </div>
      <ul>
        {voters.map(tutorialVote => (
          <li
            className="flex w-full py-4"
            key={tutorialVote.account.author.toString()}
          >
            <UserAvatar address={tutorialVote.account.author.toString()} />
          </li>
        ))}
      </ul>

      <div>
        {state.toString() !== ProposalStateE.published && (
          <div className="py-2">
            {wallet.connected ? (
              <VoteButton id={id} variant="standard" currentState={state} />
            ) : (
              <CastVoteButton id={id} variant="standard" disabled={true} />
            )}
          </div>
        )}
      </div>

      <div className="pt-4 text-sm leading-6">
        {!voteFull && (
          <>
            <p className="font-bold text-black dark:text-white">
              Not funded yet
            </p>
            <p>
              {remainder} more {remainder != 1 ? 'votes' : 'vote'} needed&nbsp;
              <a href="#" className="underline">
                learn more
              </a>
            </p>
          </>
        )}
        {voteFull && (
          <>
            <p className="font-bold text-black dark:text-white">
              This proposal is now funded!
            </p>
            <p className="dark:text-kafemellow text-kafeblack">
              But you can still vote to show your support&nbsp;{' '}
              <a href="#" className="underline">
                learn more
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default TutorialProposalVotes;
