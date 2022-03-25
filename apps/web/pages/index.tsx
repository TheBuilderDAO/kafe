import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import Gateway from 'public/assets/images/gateway.png';
import routes from 'routes';
import HomeCTA from '@app/components/Index/HomeCTA';
import Carousel from '@app/components/Index/Carousel';
import Realtime from '@app/components/Index/Realtime';
import Image from 'next/image';

const LandingPage: NextPage = () => {
  return (
    <div className="relative left-4 z-0 -top-16 text-kafeblack dark:text-kafewhite min-h-[1200px] w-full mb-40">
      <Head>
        <title>Builder DAO</title>
      </Head>
      <main>
        <Image src={Gateway} width={586} height={792} alt="gateway" />
        <div className="absolute top-96 left-20">
          <HomeCTA
            headline="Learn from guides written by our community"
            path={routes.learn.index}
            cta="view all guides"
          />
        </div>
        <div className="absolute top-28 right-12">
          <Realtime />
        </div>
        <div className="absolute top-[260px] left-[440px]">
          <Carousel />
        </div>
        <div className="absolute top-[680px] left-32">
          <Carousel variation="dotted" />
        </div>
        <div className="absolute bottom-64 right-32">
          <HomeCTA
            headline="Vote on proposals for guides you want to be written"
            path={routes.vote.index}
            cta="view all proposals"
          />
        </div>
        <div className="absolute -bottom-28 left-20">
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
