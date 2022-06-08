import PropL from 'public/assets/images/prop_card_l.png';
import PropD from 'public/assets/images/prop_card_d.png';
import ProposeLight from 'public/assets/images/propose_l.png';
import ProposeDark from 'public/assets/images/propose_d.jpeg';

import Image from 'next/image';
import HomeCTA from '../Index/HomeCTA';
import routes from 'routes';

export const WriteProposalsSection = () => {
  return (
    <section className=" z-10 grid grid-cols-1 md:grid-cols-2 relative min-h-[30rem] h-auto items-center py-4 px-8">
      <span className="text-kafedarkred">
        <HomeCTA
          headline="Create your own proposal and get rewarded in KAFE"
          path={routes.write.index}
          cta="create a proposal"
        />
      </span>
      <BgImage />
    </section>
  );
};

const BgImage = () => {
  return (
    <div className="relative -z-10 w-full object-contain max-w-[100vw]">
      <div className="absolute -left-40 -top-36 overflow-hidden">
        <span className="dark:block hidden w-full max-w-[420px]">
          <Image
            src={ProposeDark}
            width={400}
            height={400}
            alt="create"
            priority={true}
          />
        </span>
        <span className="dark:hidden block w-full max-w-[420px]">
          <Image
            src={ProposeLight}
            width={400}
            height={400}
            alt="create"
            priority={true}
          />
        </span>
      </div>
      <div className="absolute inset-0 w-[457px]">
        <span className="dark:block hidden w-full max-w-[420px]">
          <Image
            src={PropD}
            width={457}
            height={280}
            alt="propose"
            priority={true}
          />
        </span>
        <span className="dark:hidden block w-full max-w-[420px]">
          <Image
            src={PropL}
            width={457}
            height={280}
            alt="propose"
            priority={true}
          />
        </span>
      </div>
    </div>
  );
};
