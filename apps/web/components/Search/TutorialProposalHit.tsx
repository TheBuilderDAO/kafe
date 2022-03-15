import Tags from '../Tags/Tags';
import VoteButton from '@app/components/VoteButton/VoteButton';
import BorderSVG from '../SVG/BorderSVG';
import {
  useGetDaoState,
  useGetListOfVoters,
} from '@builderdao-sdk/dao-program';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import ImageStack from '../ImageStack';
import UserAvatar from '@app/components/UserAvatar/UserAvatar'

const TutorialProposalHit = props => {
  const { loading, daoState, error } = useGetDaoState();

  const {
    voters,
    loading: listLoading,
    error: listError,
  } = useGetListOfVoters(props.hit.objectID);

  console.log('VOTERS', voters);

  return (
    <div className="mb-8 text-kafeblack dark:text-kafewhite z-10 relative min-w-[800px]">
      <BorderSVG />
      <div className="p-6">
        <div className="flex flex-row justify-between">
          <div className="flex items-center p-6">
            <p>Proposal by</p>
            <UserAvatar address={props.hit.author} />
          </div>

          {loading || listLoading ? (
            <div>...</div>
          ) : (
            <div className="flex flex-row items-center gap-2 text-right">
              <div className="flex">
                <div className="mr-2">
                  {voters.length}
                  <span className="text-[#8E8980]">
                    /{daoState.quorum.toString()}{' '}
                  </span>
                  <p className="-mt-1.5 text-[#8E8980]">votes</p>
                </div>
                <ImageStack addresses={voters.map(vote => vote.account.author.toString())} />
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
              <div className="font-bold font-larken text-5xl tracking-wider">
                {props.hit.title}
              </div>
              <div className="font-thin tracking-wider text-sm leading-6 pt-2 pb-6">
                {props.hit.description}
              </div>
            </div>
            <div className="mb-4">
              <Tags tags={props.hit.tags} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialProposalHit;
