import Link from 'next/link';
import routes from 'routes';
import Tags from '../Tags/Tags';
import VoteButton from '@app/components/VoteButton/VoteButton';
import { addEllipsis } from 'utils/strings';
import {
  useGetDaoState,
  useGetListOfVoters,
} from '@builderdao-sdk/dao-program';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';

const TutorialProposalHit = props => {
  const { loading, daoState, error } = useGetDaoState();

  const {
    voters,
    loading: listLoading,
    error: listError,
  } = useGetListOfVoters(props.hit.objectID);

  return (
    <div className="mb-8 overflow-hidden border-dotted dark:bg-kafeblack border-3 bg-kafelighter text-kafeblack dark:text-kafewhite rounded-3xl">
      <div className="flex flex-row content-center justify-between px-4 py-5 sm:px-6">
        {/*<div className="hit-name">*/}
        {/*  <Highlight attribute="title" hit={props.hit}/>*/}
        {/*</div>*/}

        <div>Proposal by {addEllipsis(props.hit.author)}</div>

        {loading || listLoading ? (
          <div>...</div>
        ) : (
          <div className="flex flex-row content-center gap-5">
            <div>
              {voters.length} / {daoState.quorum.toString()} votes
            </div>
            <IsLoggedIn>
              <VoteButton id={props.hit.objectID} />
            </IsLoggedIn>
          </div>
        )}
      </div>
      <div className="flex flex-row content-center justify-between px-4 py-5 sm:p-6">
        <div>
          <div className="mb-4">
            <div className="font-bold">{props.hit.title}</div>
            <div>{props.hit.description}</div>
          </div>
          <div className="mb-4">
            Tags: <Tags tags={props.hit.tags} />
          </div>
          <div className="mb-4">Difficulty: {props.hit.difficulty}</div>
        </div>
        <div>
          <Link href={routes.vote.proposal(props.hit.slug)} passHref>
            <a className="inline-flex items-center px-4 py-2 font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm">
              Show
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TutorialProposalHit;
