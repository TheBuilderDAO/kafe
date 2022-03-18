import React, { useEffect, useState } from 'react';
import HighlightSVG from './SVG/Highlight';
import { motion } from 'framer-motion';

const Banner = ({ header, description, link }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const yPos = window.scrollY;
      if (yPos > 0) {
        setFade(true);
      } else {
        setFade(false);
      }
    }
    window.addEventListener('scroll', handleScroll, false);
    return () => {
      window.removeEventListener('scroll', handleScroll, false);
    };
  }, [fade]);
  return (
    <motion.div
      animate={{
        opacity: fade ? 0 : 1,
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
