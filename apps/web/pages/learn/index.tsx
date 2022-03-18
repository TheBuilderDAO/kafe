import React from 'react';
import Head from 'next/head';
import { TutorialCard } from '@builderdao/ui';
import defaultAvatar from '/public/assets/icons/default_avatar.svg';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { getTutorialPaths } from '@builderdao/md-utils';
import RightSidebar from 'layouts/PublicLayout/RightSidebar';
import TutorialFilter from '@app/components/TutorialFilter';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import Banner from '@app/components/Banner';
import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
} from '@app/constants';

const LearnIndexPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = props => {
  const { allTutorials } = props;
  const searchClient = algoliasearch(
    NEXT_PUBLIC_ALGOLIA_APP_ID as string,
    NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
  );

  return (
    <>
      <Head>
        <title>Search Tutorial Proposals</title>
      </Head>
      <main className="mt-10  min-w-[900px]">
        <Banner
          header="Learn from guides written by our community"
          description="If you like a guide, you can support the creators by tipping"
          link="https://figment.io"
        />
        <div className="z-30 flex mt-20 mb-20">
          <section className="z-10 mt-32 min-w-[780px]">
            <div>
              {allTutorials.map((tutorial, index) => (
                <TutorialCard
                  key={`tutorial-${tutorial.config.slug}`}
                  tutorial={tutorial.config}
                  defaultAvatar={defaultAvatar}
                />
              ))}
            </div>
          </section>
          <RightSidebar>
            <InstantSearch
              searchClient={searchClient}
              indexName={NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
            >
              <Configure hitsPerPage={4} analytics={false} />
              <TutorialFilter />
            </InstantSearch>
          </RightSidebar>
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
