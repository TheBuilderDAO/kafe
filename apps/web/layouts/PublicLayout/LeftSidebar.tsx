import React from 'react';
import Navigation from './Navigation';
import DAOSVG from '@app/components/SVG/DAOSVG';
import LogoSVG from '@app/components/SVG/LogoSVG';
import Link from 'next/link';
import routes from '../../routes';
import { useRouter } from 'next/router';
import {
  motion,
  useMotionTemplate,
  useSpring,
  useTransform,
  useViewportScroll,
} from 'framer-motion';

const LeftSidebar = () => {
  const router = useRouter();
  const homepage = router.pathname === routes.home;
  const { scrollYProgress } = useViewportScroll();
  const headingSize = useTransform(
    scrollYProgress,
    [0, 0.4],
    [homepage ? 400 : 270, 150],
  );
  const fontSize = useTransform(scrollYProgress, [0, 0.4], [14, 0]);
  const headingSizeSpring = useSpring(headingSize, {
    mass: 0.005,
  });
  const fontSizeSpring = useSpring(fontSize, {
    mass: 0.005,
  });
  const fontSizePx = useMotionTemplate`${fontSizeSpring}px`;
  const headingSizePx = useMotionTemplate`${headingSizeSpring}px`;

  return (
    <div className="w-full sticky top-5">
      <div>
        <Link key="learn" href={routes.home} passHref>
          <div className="z-0 mt-0 cursor-pointer">
            <motion.div style={{ width: headingSizePx }}>
              <LogoSVG />
              {homepage && (
                <motion.div
                  className="text-right text-sm pt-2"
                  style={{ fontSize: fontSizePx }}
                >
                  Build a better internet, together
                </motion.div>
              )}
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
