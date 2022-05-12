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
  useMotionValue,
  useSpring,
  useTransform,
  useViewportScroll,
} from 'framer-motion';

const LeftSidebar = () => {
  const router = useRouter();
  const homepage = router.pathname === routes.home;
  const { scrollYProgress } = useViewportScroll();
  const y = useMotionValue(0);
  const headingSize = useTransform(
    scrollYProgress,
    [0, 0.004],
    [homepage ? 400 : 270, 150],
  );
  const fontSize = useTransform(scrollYProgress, [0, 0.004], [14, 0]);
  const headingSizeSpring = useSpring(headingSize, {
    mass: 0.05,
  });
  const fontSizeSpring = useSpring(fontSize, {
    mass: 0.05,
  });
  const fontSizePx = useMotionTemplate`${fontSizeSpring}px`;
  const headingSizePx = useMotionTemplate`${headingSizeSpring}px`;

  return (
    <div className="sticky w-full top-10">
      <div>
        <Link key="learn" href={routes.home} passHref>
          <div className="z-0 mt-0 cursor-pointer">
            <motion.div style={{ width: headingSizePx }}>
              <LogoSVG />
              {homepage && (
                <motion.div
                  className="pt-2 text-sm text-right"
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
        <a
          href="https://builderdao.notion.site"
          target="_blank"
          rel="noreferrer"
        >
          <DAOSVG />
        </a>
      </div>
    </div>
  );
};

export default LeftSidebar;
