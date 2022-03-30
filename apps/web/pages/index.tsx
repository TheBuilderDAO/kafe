import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import routes from 'routes';
import HomeCTA from '@app/components/Index/HomeCTA';
import GuidesCarousel from '@app/components/Carousel/GuidesCarousel';
import ProposalsCarousel from '@app/components/Carousel/ProposalsCarousel';
import LearnDark from 'public/assets/images/learn_l.png';
import Image from 'next/image';

const LandingPage: NextPage = () => {
  return (
    <div className="w-10/12">
      <Head>
        <title>Builder DAO</title>
      </Head>
      <main className="mt-48 p-8">
        <div className="flex justify-between flex-wrap items-center">
          <HomeCTA
            headline="Learn from guides written by our community"
            path={routes.learn.index}
            cta="view all guides"
            color="kafegold"
          />
          <div className="relative">
            <GuidesCarousel />
            <div className="absolute -top-20 right-60 z-0">
              <Image src={LearnDark} width={400} height={400} alt="learn" />
            </div>
          </div>
        </div>
        <div className="flex justify-between flex-wrap items-center mt-40">
          <ProposalsCarousel />
          <HomeCTA
            headline="Vote on proposals for guides you want to be written"
            path={routes.vote.index}
            cta="view all proposals"
            color="kafepurple"
          />
        </div>
        <div className="flex justify-between flex-wrap items-center mt-40">
          <HomeCTA
            headline="Create your own proposal and get rewarded in KAFE"
            path={routes.write.index}
            cta="create a proposal"
            color="kafered"
          />
          <GuidesCarousel />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
