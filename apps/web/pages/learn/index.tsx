import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { getTutorialPaths } from '@builderdao/md-utils';
import RightSidebar from 'layouts/PublicLayout/RightSidebar';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import Banner from '@app/components/Banner';
import HitFilter from '@app/components/Search/HitFilter';
import {
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  NEXT_PUBLIC_ALGOLIA_APP_ID,
} from '@app/constants';
import GuideStateTabs from '@app/components/Search/GuideStateTabs';
import { ProposalStateE } from '@builderdao/program-tutorial';
import GuideHit from '@app/components/Search/GuideHit';
import Pagination from '@app/components/Search/Pagination';
import IsAdmin from '@app/components/IsAdmin/IsAdmin';
import Link from 'next/link';
import useSearchState from '../../hooks/useSearchState';
import GuideHits from '@app/components/Search/GuideHits';

const PER_PAGE = 10;

const searchClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);

const LearnIndexPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = props => {
  const { allTutorials } = props;
  const searchStateProps = useSearchState();

  return (
    <>
      <Head>
        <title>Kafé by Builder DAO - Search Guides</title>
      </Head>
      <main className="mt-10">
        <Banner
          header="Learn from guides written by our community"
          description="If you like a guide, you can support the creators by tipping"
          link="https://builderdao.notion.site/Kaf-by-Builder-DAO-b46af3ff401448d789288f4b94814e19"
        />
        <div className="z-30 flex mb-20">
          <InstantSearch
            searchClient={searchClient}
            indexName={NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
            {...searchStateProps}
          >
            <Configure
              hitsPerPage={PER_PAGE}
              analytics={false}
              filters="state:published"
            />
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col mt-16 grow min-w-[500px] max-w-[800px]">
                <div className="lg:my-6 ">
                  <IsAdmin>
                    <div className="mb-6">
                      <GuideStateTabs
                        attribute="state"
                        defaultRefinement={[ProposalStateE.published]}
                      />
                    </div>
                  </IsAdmin>
                  <GuideHits />
                  <Pagination />
                  {process.env.NODE_ENV === 'development' ? (
                    <div className="space-y-0.5 divide-y-2">
                      {allTutorials.map(tutorial => (
                        <div key={tutorial.slug} className="">
                          <Link href={`/learn/${tutorial.slug}`}>
                            {tutorial.config.title}
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <RightSidebar>
                <HitFilter />
              </RightSidebar>
            </div>
          </InstantSearch>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async context => {
  const { allPaths, allTutorials } = await getTutorialPaths();
  return {
    props: {
      allPaths,
      allTutorials,
    },
  };
};

export default LearnIndexPage;
