import React from 'react';
import HighlightSVG from './SVG/Highlight';
import { motion, useTransform, useViewportScroll } from 'framer-motion';

const Banner = ({ header, description, link }) => {
  const { scrollYProgress } = useViewportScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  return (
    <motion.div
      className={
        'absolute left-4 sm:left-0 right-0 top-52 sm:top-16 text-xs leading-2 mx-auto w-[360px] lg:block'
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
          <a className="underline" href={link} target="_blank" rel="noreferrer">
            Learn more
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default Banner;
