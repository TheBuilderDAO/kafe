import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import RightSidebar from 'layouts/PublicLayout/RightSidebar';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import Banner from '@app/components/Banner';
import {
  // NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
} from '@app/constants';
import GuideStateTabs from '@app/components/Search/GuideStateTabs';
import { ProposalStateE } from '@builderdao-sdk/dao-program';
import GuideHit from '@app/components/Search/GuideHit';
import Pagination from '@app/components/Search/Pagination';
import GuideFilter from '@app/components/Search/GuideFilter';

const NEXT_PUBLIC_ALGOLIA_APP_ID = 'BUCGOMYP6K';

const searchClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);

const LearnIndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Search Guides</title>
      </Head>
      <main className="w-full">
        <Banner
          header="Learn from guides written by our community"
          description="If you like a guide, you can support the creators by tipping"
          link="https://figment.io"
        />
        <div className="z-30 flex mb-20">
          <InstantSearch
            searchClient={searchClient}
            indexName={NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
          >
            <Configure hitsPerPage={4} analytics={false} />
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col mt-16 grow min-w-[500px] max-w-[800px]">
                <div className="lg:my-6 lg:mt-10 mt-10 mb-4">
                  <GuideStateTabs
                    attribute="state"
                    defaultRefinement={[ProposalStateE.published]}
                  />
                </div>
                <Hits hitComponent={GuideHit} />
                <Pagination />
              </div>
              <RightSidebar>
                <GuideFilter />
              </RightSidebar>
            </div>
          </InstantSearch>
        </div>
      </main>
    </>
  );
};

export default LearnIndexPage;
