import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import Gateway from '@app/components/SVG/Gateway';
import routes from 'routes';
import HomeCTA from '@app/components/Index/HomeCTA';

const LandingPage: NextPage = () => {
  return (
    <div className="relative text-kafeblack dark:text-kafewhite min-h-[1200px] w-[900px]">
      <Head>
        <title>Builder DAO</title>
      </Head>
      <main>
        <Gateway />
        <div className="absolute top-96 left-20 ">
          <HomeCTA
            headline="Learn from guides written by our community"
            path={routes.learn.index}
            cta="view all guides"
          />
        </div>
        <div className="absolute top-[650px] right-0">
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
