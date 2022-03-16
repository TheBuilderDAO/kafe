import React from 'react'
import { addEllipsis } from '../../utils/strings'
import VoteButton from '../VoteButton/VoteButton'
import { ProposalStateE, useGetDaoState, useGetListOfVoters } from '@builderdao-sdk/dao-program'
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn'

type TutorialProposalVotesProps = {
  id: number;
  state: ProposalStateE;
};

const TutorialProposalVotes = (props: TutorialProposalVotesProps) => {
  const { id, state } = props;

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

      <IsLoggedIn>
        {state === ProposalStateE.submitted && (
          <VoteButton id={id} />
        )}
      </IsLoggedIn>
    </div>
  );
};

export default TutorialProposalVotes;
