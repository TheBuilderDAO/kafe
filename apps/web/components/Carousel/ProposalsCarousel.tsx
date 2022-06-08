import React from 'react';
import UserAvatar from '@app/components/UserAvatar/UserAvatar';
import VoteLight from 'public/assets/images/vote_l.png';
import VoteDark from 'public/assets/images/vote_d.jpeg';
import ImageStack from '../ImageStack';
import Tags from '../Tags/Tags';
import algoliasearch from 'algoliasearch/lite';
import Link from 'next/link';
import { InstantSearch, Configure } from 'react-instantsearch-dom';
import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
} from '@app/constants';
import { connectHits } from 'react-instantsearch-dom';
import { truncateString } from '../../utils/strings';
import useCarousel from '@app/components/Carousel/useCarousel';
import Loader from '@app/components/Loader/Loader';
import routes from '../../routes';
import BorderSVG from '../SVG/BorderSVG';
import { useTheme } from 'next-themes';
import Image from 'next/image';

const PER_PAGE = 3;

const searchClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);

const ProposalCard = props => {
  const { hit } = props;

  return (
    <div
      className={
        'relative z-10 rounded-[35px] dark:border-kafewhite border-kafeblack max-w-[450px] min-h-[280px] bg-kafewhite dark:bg-kafeblack w-full'
      }
    >
      <BorderSVG />
      <div className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <small className="mr-2 text-xs">Proposal by</small>{' '}
            <UserAvatar ellipsis={true} address={hit.author} />
          </div>
          <ImageStack addresses={['1', '2', '3']} />
        </div>
        <div>
          <Link href={routes.vote.proposal(hit.slug)}>
            <h3 className="text-2xl font-larken mt-14">{hit.title}</h3>
          </Link>
          <p className="text-xs tracking-wide">
            {truncateString(hit.description)}
          </p>
          <div className="mt-4">
            <Tags tags={hit.tags} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Wrapper = ({ hits }) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const { currentIndex, handlePrev, handleNext } = useCarousel(
    PER_PAGE,
    hits.length,
  );

  if (!hits.length) {
    return <Loader />;
  }

  const hit = hits[currentIndex];

  return (
    <div className="relative w-full flex items-start justify-start">
      <div className="opacity-10 mt-[12px]">
        <ProposalCard hit={hit} />
      </div>
      <div key="dummy-2" className={`absolute ml-[12px]`}>
        <ProposalCard hit={hit} />
      </div>
      <div key="dummy-1" className={`absolute mt-[6px] ml-[6px] mr-[6px]`}>
        <ProposalCard hit={hit} />
      </div>
      <div key={hit.objectID} className={`absolute mt-[12px] mr-[12px]`}>
        <ProposalCard hit={hit} />
      </div>
    </div>
  );
};

const Proposals = connectHits(Wrapper);

const ProposalsCarousel = () => {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={`${NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_last_updated_at_desc`}
    >
      <Configure
        hitsPerPage={PER_PAGE}
        analytics={false}
        filters="state:submitted OR state:writing OR state:readyToPublish OR state:funded"
      />
      <Proposals />
    </InstantSearch>
  );
};

export default ProposalsCarousel;
