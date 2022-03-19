import React from 'react';
import LoginButton from '@app/components/LoginButton/LoginButton';
import ThemeSwitch from '../../components/Button/ThemeSwitch';
import HelpButton from '../../components/Button/HelpButton';
import LogoSVG from '../../components/SVG/LogoSVG';
import {
  motion,
  useMotionTemplate,
  useSpring,
  useTransform,
  useViewportScroll,
} from 'framer-motion';

const Header = () => {
  const { scrollYProgress } = useViewportScroll();
  const headingSize = useTransform(scrollYProgress, [0, 0.04], [350, 200]);
  const headingSizeSpring = useSpring(headingSize, {
    mass: 0.005,
  });

  const headingSizePx = useMotionTemplate`${headingSizeSpring}px`;
  return (
    <div className="flex items-start justify-between w-full">
      <div className="z-0 mt-0">
        <motion.div style={{ width: headingSizePx }}>
          <LogoSVG />
        </motion.div>
      </div>
      <div className="flex items-center relative">
        <HelpButton />
        <ThemeSwitch />
        <LoginButton />
      </div>
    </div>
  );
};

export default Header;
