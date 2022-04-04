import Tags from '../Tags/Tags';
import VoteButton from '@app/components/VoteButton/VoteButton';
import BorderSVG from '../SVG/BorderSVG';
import { useGetDaoState } from '@builderdao-sdk/dao-program';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import ImageStack from '../ImageStack';
import UserAvatar from '@app/components/UserAvatar/UserAvatar';
import routes from '../../routes';
import Link from 'next/link';

const TutorialProposalHit = props => {
  const { loading, daoState, error } = useGetDaoState();
  const { voters } = props;

  return (
    <div className="relative z-10 mb-6 text-kafeblack dark:text-kafewhite min-h-72 grow">
      <BorderSVG />
      <div className="px-8 py-4">
        <div className="flex flex-row justify-between">
          <div className="flex items-center flex-nowrap">
            <p className="mr-2 text-xs">Proposal by</p>
            <UserAvatar address={props.hit.author} />
          </div>

          {loading ? (
            <></>
          ) : (
            <div className="flex flex-row flex-wrap items-center justify-between text-right">
              <div className="flex">
                <div className="mr-2 text-xs">
                  {voters.length}
                  <span className="text-[#8E8980]">
                    /{daoState.quorum.toString()}{' '}
                  </span>
                  <p className="-mt-1 text-[#8E8980]">votes</p>
                </div>
                <div className="mr-8">
                  <ImageStack
                    addresses={voters.map(vote =>
                      vote.account.author.toString(),
                    )}
                  />
                </div>
              </div>
              <IsLoggedIn>
                <VoteButton
                  id={props.hit.objectID}
                  currentState={props.hit.state}
                />
              </IsLoggedIn>
            </div>
          )}
        </div>
        <div className="flex flex-row content-center justify-between py-8">
          <div>
            <div className="mb-4">
              <div className="text-4xl font-bold tracking-wider font-larken">
                <Link href={routes.vote.proposal(props.hit.slug)}>
                  {props.hit.title}
                </Link>
              </div>
              <div className="w-10/12 pt-1 pb-6 text-xs font-thin leading-6 tracking-wider xl:leading-8 line-clamp-2">
                <p>{props.hit.description}</p>
              </div>
            </div>
            <div className="mt-4">
              <Tags tags={props.hit.tags} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialProposalHit;
