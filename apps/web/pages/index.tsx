import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import routes from 'routes';
import HomeCTA from '@app/components/Index/HomeCTA';
import GuidesCarousel from '@app/components/Carousel/GuidesCarousel';
import ProposalsCarousel from '@app/components/Carousel/ProposalsCarousel';
import { useTheme } from 'next-themes';
import { LearnGuidesSection } from '@app/components/Sections/LearnGuidesSection';
import { VoteProposalsSection } from '@app/components/Sections/VoteProposalsSection';
import { WriteProposalsSection } from '@app/components/Sections/WriteProposalsSection';

const LandingPage: NextPage = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <div>
      <Head>
        <title>Builder DAO</title>
      </Head>
      <div className="z-10 w-0.5 h-[1500px]  bg-gradient-to-b from-[#B58954] via-[#6F086F] to-[#AE4F61] fixed top-0 -ml-8"></div>
      <div className="relative  flex  bg-opacity-10">
        <main className="flex flex-col w-full">
          <LearnGuidesSection />
          <VoteProposalsSection />
          <WriteProposalsSection />
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
