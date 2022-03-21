import React from 'react';
import Navigation from './Navigation';
import DAOSVG from '@app/components/SVG/DAOSVG';
import LogoSVG from '@app/components/SVG/LogoSVG';
import {
  motion,
  useMotionTemplate,
  useSpring,
  useTransform,
  useViewportScroll,
} from 'framer-motion';

const LeftSidebar = () => {
  const { scrollYProgress } = useViewportScroll();
  const headingSize = useTransform(scrollYProgress, [0, 0.04], [270, 150]);
  const headingSizeSpring = useSpring(headingSize, {
    mass: 0.005,
  });
  const headingSizePx = useMotionTemplate`${headingSizeSpring}px`;

  return (
    <div className="w-full sticky top-5">
      <div className="z-0 mt-0 hidden lg:block">
        <motion.div style={{ width: headingSizePx }}>
          <LogoSVG />
        </motion.div>
      </div>
      <Navigation />
      <a className="fixed bottom-4 left-10" href="#">
        <DAOSVG />
      </a>
    </div>
  );
};

export default LeftSidebar;
