import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import routes from 'routes';

import GuidesCarousel from '../Carousel/GuidesCarousel';
import LearnLight from 'public/assets/images/learn_l.png';
import LearnDark from 'public/assets/images/learn_d.jpeg';

export const LearnGuidesSection = () => {
  return (
    <section className=" z-10 flex flex-col md:flex-row relative min-h-[20rem] h-auto items-center justify-center py-4 px-8">
      <BgImage />
      <span className="text-kafedarkred md:w-1/3">
        <HomeCTA
          headline="Learn from guides written by our community"
          path={routes.learn.index}
          cta="view all guides"
        />
      </span>
      <div className="md:w-2/3">
        <GuidesCarousel />
      </div>
    </section>
  );
};

type CTAProps = {
  headline: string;
  path: string;
  cta: string;
};
const HomeCTA = ({ headline, path, cta }: CTAProps) => {
  return (
    <div
      className={`font-larken text-2xl tracking-wider max-w-[18rem]  p-2 flex-1 `}
    >
      <h3>{headline}</h3>
      <Link href={path} passHref>
        <button className="hover:bg-kafeblack dark:hover:bg-kafewhite hover:text-kafewhite dark:hover:text-kafeblack font-space text-xs bg-kafelighter dark:bg-kafedarker p-4 rounded-2xl my-4">
          {cta}
        </button>
      </Link>
    </div>
  );
};

export const BgImage = () => {
  return (
    <div className="flex items-center justify-center w-full h-full absolute -z-10 -mt-48">
      <span className="dark:block hidden w-full max-w-[420px]">
        <Image
          src={LearnDark}
          width={420}
          height={420}
          layout="responsive"
          className="-z-10"
          alt="learn"
          priority={true}
        />
      </span>
      <span className="dark:hidden block w-full max-w-[420px]">
        <Image
          src={LearnLight}
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
