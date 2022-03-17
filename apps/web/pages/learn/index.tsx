import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head'
import { ProposalStateE } from '@builderdao-sdk/dao-program'
import Pagination from '@app/components/Search/Pagination'
import RightSidebar from '../../layouts/PublicLayout/RightSidebar'
import TutorialFilter from '@app/components/TutorialFilter'
import algoliasearch from 'algoliasearch/lite'
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';
import GuideStateTabs from '@app/components/Search/GuideStateTabs'
import GuideHit from '@app/components/Search/GuideHit'

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);

const LearnIndexPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Search Guides</title>
      </Head>

      <main>
        <InstantSearch
          searchClient={searchClient}
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
        >
          <Configure
            hitsPerPage={4}
            analytics={false}
          />
          <div className="flex justify-between items-start">
            <div className="flex flex-col grow">
              <div className="my-6">
                <GuideStateTabs attribute="state" defaultRefinement={[ProposalStateE.published]} />
              </div>
              <Hits hitComponent={GuideHit} />
              <Pagination />
            </div>
            <RightSidebar>
              <TutorialFilter />
            </RightSidebar>
          </div>
        </InstantSearch>
      </main>
    </div>
  );
};

export default LearnIndexPage;
