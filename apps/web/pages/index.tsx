import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import routes from 'routes';
import HomeCTA from '@app/components/Index/HomeCTA';
import GuidesCarousel from '@app/components/Carousel/GuidesCarousel';
import ProposalsCarousel from '@app/components/Carousel/ProposalsCarousel';
import LearnDark from 'public/assets/images/learn_d.png';
import VoteLight from 'public/assets/images/vote_l.png';
import VoteDark from 'public/assets/images/vote_d.png';
import LearnLight from 'public/assets/images/learn_l.png';
import PropL from 'public/assets/images/prop_card_l.png';
import PropD from 'public/assets/images/prop_card_d.png';
import ProposeLight from 'public/assets/images/propose_l.png';
import ProposeDark from 'public/assets/images/propose_d.png';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const LandingPage: NextPage = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <div className="w-11/12 min-w-[1050px] relative z-0">
      <Head>
        <title>Builder DAO</title>
      </Head>
      <div className="flex">
        <div className="w-0.5 h-[1800px] -mt-24 bg-gradient-to-b from-[#B58954] via-[#6F086F] to-[#AE4F61]"></div>
        <main className="pt-80 pb-40  px-20 grow">
          <div className="flex justify-between flex-wrap items-center relative">
            <div className="text-kafedarkred">
              <HomeCTA
                headline="Learn from guides written by our community"
                path={routes.learn.index}
                cta="view all guides"
              />
            </div>
            <div>
              <GuidesCarousel />
              <div className="absolute -top-20 right-64 -z-10">
                {dark && (
                  <Image src={LearnDark} width={320} height={320} alt="learn" />
                )}
                {!dark && (
                  <Image
                    src={LearnLight}
                    width={320}
                    height={320}
                    alt="learn"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between flex-wrap items-center mt-40 relative">
            <div>
              <ProposalsCarousel />
              <div className="absolute -top-14 left-64 -z-10">
                {dark && (
                  <Image src={VoteDark} width={383} height={346} alt="learn" />
                )}
                {!dark && (
                  <Image src={VoteLight} width={383} height={346} alt="learn" />
                )}
              </div>
            </div>
            <div className="text-kafedarkpurple">
              <HomeCTA
                headline="Vote on proposals for guides you want to be written"
                path={routes.vote.index}
                cta="view all proposals"
              />
            </div>
          </div>
          <div className="flex justify-between flex-wrap items-center mt-40 relative">
            <div className="text-kafedarkred">
              <HomeCTA
                headline="Create your own proposal and get rewarded in KAFE"
                path={routes.write.index}
                cta="create a proposal"
              />
            </div>
            <div>
              <div>
                {dark && (
                  <Image src={PropD} width={427} height={250} alt="propose" />
                )}
                {!dark && (
                  <Image src={PropL} width={427} height={250} alt="propose" />
                )}
              </div>
              <div className="absolute -top-16 left-96 -z-10">
                {dark && (
                  <Image
                    src={ProposeDark}
                    width={300}
                    height={300}
                    alt="learn"
                  />
                )}
                {!dark && (
                  <Image
                    src={ProposeLight}
                    width={300}
                    height={300}
                    alt="learn"
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
