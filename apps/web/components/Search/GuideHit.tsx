import Tags from '../Tags/Tags';
import UserAvatar from '@app/components/UserAvatar/UserAvatar';
import routes from '../../routes';
import Link from 'next/link';
import { useGetListOfTippersById } from '@builderdao-sdk/dao-program';
import ImageStack from '@app/components/ImageStack';
import React from 'react';
import Loader from '@app/components/Loader/Loader';

const GuideHit = props => {
  const { tippers, loading, error } = useGetListOfTippersById(
    props.hit.objectID,
  );

  return (
    <div className="mb-5 border-[1px] border-kafeblack dark:border-kafewhite tutorial bg-kafelight dark:bg-kafedark z-10 relative min-h-72 text-kafeblack dark:text-kafewhite bg-kafewhite dark:bg-kafeblack mt-5 lg:mt-0 p-4">
      <div className="flex flex-row justify-between">
        <div className="flex items-center p-6">
          <p>Guide by</p>
          <UserAvatar address={props.hit.author} />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-row items-center gap-2 text-right">
            <div className="flex">
              <div className="mr-2">
                {tippers.length}
                <p className="-mt-1.5 text-[#8E8980]">supporters</p>
              </div>
              <ImageStack
                addresses={tippers.map(tip => tip.account.pubkey.toString())}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row content-center justify-between px-4 py-5 sm:p-6">
        <div>
          <div className="mb-4">
            <div className="font-bold font-larken lg:text-5xl text-3xl tracking-wider">
              <Link href={routes.learn.guide(props.hit.slug)}>
                {props.hit.title}
              </Link>
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
  );
};

export default GuideHit;
