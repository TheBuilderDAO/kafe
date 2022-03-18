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
        <section className="flex flex-row w-full gap-40 place-content-center">
          <div className="w-80">
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
          <div>
            <div className="mb-10">
              Support creators by voting for proposals you want written.
            </div>
            <div>
              <Link href={routes.vote.index} passHref={true}>
                <span className="inline-flex items-center px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                  view all guides
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LandingPage;
