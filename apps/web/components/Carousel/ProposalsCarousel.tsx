import React from 'react';
import UserAvatar from '@app/components/UserAvatar/UserAvatar';
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
import ButtonLeft from '@app/components/Carousel/ButtonLeft';
import ButtonRight from '@app/components/Carousel/ButtonRight';
import useCarousel from '@app/components/Carousel/useCarousel';
import Loader from '@app/components/Loader/Loader';
import routes from '../../routes';
import BorderSVG from '../SVG/BorderSVG';

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
        'relative z-0 rounded-3xl dark:border-kafewhite border-kafeblack w-[450px] min-h-[280px] bg-kafewhite dark:bg-kafeblack'
      }
    >
      <BorderSVG />
      <div className="p-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <small className="text-xs mr-2">Proposal by</small>{' '}
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

const Wrapper = ({ hits, currentIndex }) => {
  if (!hits.length) {
    return <Loader />;
  }

  const hit = hits[currentIndex];

  return [
    <div key={hit.objectID} className={`relative top-2 left-6`}>
      <ProposalCard hit={hit} />
    </div>,
    <div key="dummy-1" className={`absolute top-4 left-4`}>
      <ProposalCard hit={hit} />
    </div>,
    <div key="dummy-2" className={`absolute top-6 left-2`}>
      <ProposalCard hit={hit} />
    </div>,
  ];
};

const Proposals = connectHits(Wrapper);

const ProposalsCarousel = () => {
  const { currentIndex, handlePrev, handleNext } = useCarousel(PER_PAGE);

  return (
    <div>
      {/* <ButtonLeft onClick={handlePrev} /> */}
      <InstantSearch
        searchClient={searchClient}
        indexName={`${NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_last_updated_at_desc`}
      >
        <Configure
          hitsPerPage={PER_PAGE}
          analytics={false}
          filters="state:submitted OR state:writing OR state:readyToPublish"
        />
        <div className="relative">
          <Proposals currentIndex={currentIndex} />
        </div>
      </InstantSearch>
      {/* <ButtonRight onClick={handleNext} /> */}
    </div>
  );
};

export default ProposalsCarousel;
