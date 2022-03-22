import React from 'react';
import Navigation from './Navigation';
import DAOSVG from '@app/components/SVG/DAOSVG';
import LogoSVG from '@app/components/SVG/LogoSVG';
import Link from 'next/link';
import routes from '../../routes';
import {
  motion,
  useMotionTemplate,
  useSpring,
  useTransform,
  useViewportScroll,
} from 'framer-motion';

const LeftSidebar = () => {
  const { scrollYProgress } = useViewportScroll();
  const headingSize = useTransform(scrollYProgress, [0, 0.4], [270, 150]);
  const headingSizeSpring = useSpring(headingSize, {
    mass: 0.005,
  });
  const headingSizePx = useMotionTemplate`${headingSizeSpring}px`;

  return (
    <div className="w-full sticky top-5">
      <div>
        <Link key="learn" href={routes.learn.index} passHref>
          <div className="z-0 mt-0 cursor-pointer">
            <motion.div style={{ width: headingSizePx }}>
              <LogoSVG />
            </motion.div>
          </div>
        </Link>
        <Navigation />
      </div>
      <div className="cursor-pointer mt-96">
        <Link key="learn" href="https://twitter.com/thebuilderdao" passHref>
          <DAOSVG />
        </Link>
      </div>
    </div>
  );
};

export default LeftSidebar;
