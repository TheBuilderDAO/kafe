import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import TutorialProposalHit from '@app/components/Search/TutorialProposalHit';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';
import Link from 'next/link';
import routes from 'routes';
import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
} from '@app/constants';

const searchClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
);

const LandingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Builder DAO</title>
      </Head>
      <main className="flex flex-col">
        <section className="flex flex-row justify-between w-full mt-20">
          <div className="w-44">
            <InstantSearch
              searchClient={searchClient}
              indexName={NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
            >
              <Configure
                filters="state:proposed"
                hitsPerPage={1}
                analytics={false}
              />
              <div className="flex flex-row gap-10">
                <div className="w-full">
                  <Hits hitComponent={TutorialProposalHit} />
                </div>
              </div>
            </InstantSearch>
          </div>
        </section>
      </main>
    </>
  );
};

export default LandingPage;
