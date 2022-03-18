import React from 'react';
import { TutorialCard } from '@builderdao/ui';
import defaultAvatar from '../../public/assets/icons/default_avatar.svg'; //figure out why direct import not working here
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { getTutorialPaths } from '@builderdao/md-utils';
import _ from 'lodash';

const LearnIndexPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = props => {
  const { allTutorials } = props;
  console.log(allTutorials);
  return (
    <div>
      <section>
        <div>
          {allTutorials.map((tutorial, index) => (
            <TutorialCard
              key={`tutorial-${tutorial.config.slug}`}
              tutorial={{ ...tutorial.config, ...tutorial.lock }}
              defaultAvatar={defaultAvatar}
            />
          ))}
        </div>
      </section>
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
