import routes from 'routes';
import ProposalsCarousel from '../Carousel/ProposalsCarousel';
import Image from 'next/image';

import VoteLight from 'public/assets/images/vote_l.png';
import VoteDark from 'public/assets/images/vote_d.jpeg';
import HomeCTA from '../Index/HomeCTA';

export const VoteProposalsSection = () => {
  return (
    <section className="z-10 flex flex-col-reverse md:flex-row relative min-h-[40rem] h-auto items-center py-4 px-8 w-full justify-between">
      <div className="md:w-2/3 w-full z-10 -ml-10 md:ml-0 ">
        <ProposalsCarousel />
      </div>
      <div className="text-kafedarkpurple  w-full flex md:w-1/3 items-end ">
        <div className="md:ml-auto">
          <HomeCTA
            headline="Vote on proposals for guides you want to be written"
            path={routes.vote.index}
            cta="view all proposals"
          />
        </div>
      </div>
      <BgImage />
    </section>
  );
};

export const BgImage = () => {
  return (
    <div className="flex items-center justify-center w-full h-full absolute -z-40 -mt-52">
      <span className="dark:block hidden w-full max-w-[420px] -z-20">
        <Image
          src={VoteDark}
          width={420}
          height={420}
          layout="responsive"
          alt="learn"
          priority={true}
        />
      </span>
      <span className="dark:hidden block w-full max-w-[420px] -z-20">
        <Image
          src={VoteLight}
          width={420}
          height={420}
          layout="responsive"
          alt="learn"
          priority={true}
        />
      </span>
    </div>
  );
};
