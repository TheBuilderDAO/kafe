import React, { useEffect } from 'react';
import { addEllipsis } from '../../utils/strings';
import { useDapp } from '../../hooks/useDapp';
import VoteButton from '../VoteButton/VoteButton';
import {
  useGetDaoState,
  useGetListOfVoters,
} from '@builderdao-sdk/dao-program';

type TutorialProposalVotesProps = {
  id: number;
};

const TutorialProposalVotes = (props: TutorialProposalVotesProps) => {
  const { id } = props;
  const { wallet } = useDapp();

  const { daoState, loading, error } = useGetDaoState();
  const {
    voters,
    loading: listLoading,
    error: listError,
  } = useGetListOfVoters(id);

  if (loading || listLoading) {
    return <div>Loading...</div>;
  }

  if (error || listError) {
    return <div>Error occurred</div>;
  }

  return (
    <div className="text-black">
      <h3>
        Voters{' '}
        <small>
          {voters.length} / {daoState.quorum.toString()} votes
        </small>
      </h3>
      <ul>
        {voters.map((tutorialVote, index) => (
          <li className="py-4" key={tutorialVote.account.author.toString()}>
            {index + 1}. {addEllipsis(tutorialVote.account.author.toString())}
          </li>
        ))}
      </ul>

      {wallet.connected && <VoteButton id={id} />}
    </div>
  );
};

export default TutorialProposalVotes;
