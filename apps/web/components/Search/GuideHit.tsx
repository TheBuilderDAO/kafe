import Tags from '../Tags/Tags';
import UserAvatar from '@app/components/UserAvatar/UserAvatar';
import routes from '../../routes';
import Link from 'next/link';
import { useGetListOfTippersById } from '@builderdao-sdk/dao-program';
import ImageStack from '@app/components/ImageStack';
import React from 'react';

const TippersInfo = ({ id }) => {
  const { tippers, loading, error } = useGetListOfTippersById(id);
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <svg
          className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading
      </div>
    );
  } else if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-row items-center gap-2 text-right">
      <div className="flex items-center">
        <ImageStack
          addresses={tippers.map(tip => tip.account.pubkey.toString())}
        />
        <p className="ml-6 text-sm">
          {tippers.length} {tippers.length !== 1 ? 'supporters' : 'supporter'}
        </p>
      </div>
    </div>
  );
};

const GuideHit = props => {
  return (
    <div className="mb-5 border-[1px] border-kafeblack dark:border-kafewhite bg-kafelight dark:bg-kafedark z-10 relative min-h-72 text-kafeblack dark:text-kafewhite bg-kafewhite dark:bg-kafeblack mt-0 p-4">
      <div className="flex flex-row justify-between">
        <div className="flex items-center p-6 text-xs">
          <p className="mr-2">Guide by</p>
          <UserAvatar address={props.hit.author} />
        </div>
        <TippersInfo id={props.hit.objectID} />
      </div>
      <div className="flex flex-row content-center justify-between px-4 py-5 sm:p-6">
        <div>
          <div className="mb-4">
            <div className="text-4xl font-bold tracking-wider font-larken">
              <Link href={routes.learn.guide(props.hit.slug)}>
                {props.hit.title}
              </Link>
            </div>
            <div className="pt-2 pb-6 text-sm font-thin leading-6 tracking-wider">
              {props.hit.description}
            </div>
          </div>
          <div>
            <Tags tags={props.hit.tags} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideHit;
