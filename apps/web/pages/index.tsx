import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import Gateway from 'public/assets/images/gateway.png';
import routes from 'routes';
import HomeCTA from '@app/components/Index/HomeCTA';
import GuidesCarousel from '@app/components/Carousel/GuidesCarousel';
import ProposalsCarousel from '@app/components/Carousel/ProposalsCarousel';
import Realtime from '@app/components/Index/Realtime';
import Image from 'next/image';

const LandingPage: NextPage = () => {
  return (
    <div className="max-w-[400px]">
      <Head>
        <title>Builder DAO</title>
      </Head>
      <main className="mt-64">
        <div className="flex justify-between">
          <HomeCTA
            headline="Learn from guides written by our community"
            path={routes.learn.index}
            cta="view all guides"
          />
          <GuidesCarousel />
        </div>
        <ProposalsCarousel />
        <HomeCTA
          headline="Vote on proposals for guides you want to be written"
          path={routes.vote.index}
          cta="view all proposals"
        />
        <HomeCTA
          headline="Create your own proposal, and get paid in $KAFE to write"
          path={routes.write.index}
          cta="create a proposal"
        />
      </main>
    </div>
  );
};

export default LandingPage;
