import React from 'react';
import Link from 'next/link';

type CTAProps = {
  headline: string;
  path: string;
  cta: string;
  color: string;
};
const HomeCTA = ({ headline, path, cta, color }: CTAProps) => {
  return (
    <div className={`font-larken text-2xl tracking-wider w-64 text-${color}`}>
      <h3>{headline}</h3>
      <Link href={path} passHref>
        <button className="hover:bg-kafeblack dark:hover:bg-kafewhite hover:text-kafewhite dark:hover:text-kafeblack font-space text-xs bg-kafelighter dark:bg-kafedarker p-4 rounded-2xl my-4">
          {cta}
        </button>
      </Link>
    </div>
  );
};

export default HomeCTA;
