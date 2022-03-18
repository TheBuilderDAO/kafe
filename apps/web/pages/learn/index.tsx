import React from 'react';
import { TutorialCard } from '@builderdao/ui';
import defaultAvatar from '/public/assets/icons/default_avatar.svg';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { getTutorialPaths } from '@builderdao/md-utils';
import RightSidebar from 'layouts/PublicLayout/RightSidebar';
import TutorialFilter from '@app/components/TutorialFilter';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';

const LearnIndexPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = props => {
  const { allTutorials } = props;
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
  );

  return (
    <div className="flex mt-10 mb-20 z-30">
      <section>
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
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
        >
          <Configure hitsPerPage={4} analytics={false} />
          <TutorialFilter />
        </InstantSearch>
      </RightSidebar>
    </div>
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
