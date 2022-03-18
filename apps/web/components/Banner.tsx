import React from 'react';
import HighlightSVG from './SVG/Highlight';
import { motion, useTransform, useViewportScroll } from 'framer-motion';

const Banner = ({ header, description, link }) => {
  const { scrollYProgress } = useViewportScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.2]);
  return (
    <motion.div
      className={'absolute left-0 right-0 mx-auto w-96 top-32'}
      style={{
        opacity,
      }}
    >
      <HighlightSVG />
      <div className="text-sm">
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
