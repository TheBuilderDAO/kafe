import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import Gateway from '@app/components/SVG/Gateway';
import routes from 'routes';
import HomeCTA from '@app/components/Index/HomeCTA';
import Carousel from '@app/components/Index/Carousel';

const LandingPage: NextPage = () => {
  return (
    <div className="relative -left-6 z-0 -top-16 text-kafeblack dark:text-kafewhite min-h-[1200px] w-[940px]">
      <Head>
        <title>Builder DAO</title>
      </Head>
      <main>
        <Gateway />
        <div className="absolute top-96 left-20">
          <HomeCTA
            headline="Learn from guides written by our community"
            path={routes.learn.index}
            cta="view all guides"
          />
        </div>
        <div className="absolute top-80 right-96">
          <Carousel />
        </div>
        <div className="absolute top-[650px] left-48">
          <Carousel variation="dotted" />
        </div>
        <div className="absolute top-[700px] -right-10">
          <HomeCTA
            headline="Vote on proposals for guides you want to be written"
            path={routes.vote.index}
            cta="view all proposals"
          />
        </div>
        <div className="absolute bottom-0 left-20">
          <HomeCTA
            headline="Create your own proposal, and get paid in $KAFE to write"
            path={routes.write.index}
            cta="create a proposal"
          />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
