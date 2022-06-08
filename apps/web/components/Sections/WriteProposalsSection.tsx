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
      <BgImage />
      <span className="text-kafedarkred">
        <HomeCTA
          headline="Create your own proposal and get rewarded in KAFE"
          path={routes.write.index}
          cta="create a proposal"
        />
      </span>
    </section>
  );
};

const BgImage = () => {
  return (
    <div className="relative">
      <div className="absolute -left-40 -top-36">
        <span className="dark:block hidden">
          <Image
            src={ProposeDark}
            width={400}
            height={400}
            alt="create"
            priority={true}
          />
        </span>
        <span className="dark:hidden block">
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
        <span className="dark:block hidden">
          <Image
            src={PropD}
            width={457}
            height={280}
            alt="propose"
            priority={true}
          />
        </span>
        <span className="dark:hidden block">
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
