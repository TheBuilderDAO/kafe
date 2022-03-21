import React from 'react';
import HighlightSVG from './SVG/Highlight';
import { motion, useTransform, useViewportScroll } from 'framer-motion';

const Banner = ({ header, description, link }) => {
  const { scrollYProgress } = useViewportScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  return (
    <motion.div
      className={
        'fixed left-0 right-0 text-xs leading-2 mx-auto w-[360px] hidden lg:block top-24'
      }
      style={{
        opacity,
      }}
    >
      <HighlightSVG />
      <div>
        <p className="font-black">{header}</p>
        <p>
          {description}{' '}
          <a className="underline" href={link}>
            Learn more
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default Banner;
