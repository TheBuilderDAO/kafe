import React from 'react';
import Link from 'next/link';

type CTAProps = {
  headline: string;
  path: string;
  cta: string;
};
const HomeCTA = ({ headline, path, cta }: CTAProps) => {
  return (
    <div className="font-larken text-2xl tracking-wider w-64">
      <h3>{headline}</h3>
      <Link href={path} passHref>
        <button className="font-space text-xs bg-kafelighter dark:bg-kafedarker px-3 py-4 rounded-2xl my-2">
          {cta}
        </button>
      </Link>
    </div>
  );
};

export default HomeCTA;
