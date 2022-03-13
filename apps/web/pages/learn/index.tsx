import React from 'react';
import { TutorialCard } from '@builderdao/ui';
import defaultAvatar from '/public/assets/icons/default_avatar.svg';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { getTutorialPaths } from '@builderdao/md-utils';
import RightSidebar from 'layouts/PublicLayout/RightSidebar';

const LearnIndexPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = props => {
  const { allTutorials } = props;
  return (
    <div>
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
        <p>Hey</p>
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
