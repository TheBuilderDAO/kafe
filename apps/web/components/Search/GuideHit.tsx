import Tags from '../Tags/Tags';
import UserAvatar from '@app/components/UserAvatar/UserAvatar';
import routes from '../../routes';
import Link from 'next/link';
import { useGetListOfTippersById } from '@builderdao/use-program-tutorial';
import ImageStack from '@app/components/ImageStack';
import React from 'react';
import Loader from '../Loader/Loader';

const TippersInfo = ({ tippers, id }) => {
  return (
    <div className="flex flex-row items-center">
      <div className="flex items-center flex-row-reverse">
        <div className="ml-2">
          <ImageStack
            addresses={tippers.map(tip => tip.account.pubkey.toString())}
          />
        </div>
        <p className="text-xs">
          {tippers.length} {tippers.length !== 1 ? 'supporters' : 'supporter'}
        </p>
      </div>
    </div>
  );
};

const GuideHit = props => {
  const { tippers } = props;
  return (
    <div className="mb-4 border-[1px] border-kafeblack dark:border-kafewhite bg-kafelight dark:bg-kafedark z-10 relative min-h-72 text-kafeblack dark:text-kafewhite bg-kafewhite dark:bg-kafeblack mt-0 p-6">
      <div className="flex flex-row justify-between">
        <div className="flex items-center text-xs">
          <p className="mr-2">Guide by</p>
          <UserAvatar address={props.hit.author} />
        </div>
        <TippersInfo tippers={tippers} id={props.hit.objectID} />
      </div>
      <div className="flex flex-row content-center justify-between">
        <div>
          <div className="mb-4 pr-40">
            <div className="text-4xl font-bold tracking-wider font-larken mt-8 mb-2">
              <Link href={routes.learn.guide(props.hit.slug)}>
                {props.hit.title}
              </Link>
            </div>
            <div className="text-sm font-thin leading-6 tracking-wider mb-4">
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
