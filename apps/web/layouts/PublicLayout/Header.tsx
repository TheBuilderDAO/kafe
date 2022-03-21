import React from 'react';
import LoginButton from '@app/components/LoginButton/LoginButton';
import ThemeSwitch from '../../components/Button/ThemeSwitch';
import HelpButton from '../../components/Button/HelpButton';
import LogoSVG from '../../components/SVG/LogoSVG';

const Header = () => {
  return (
    <div className="flex items-start flex-col lg:flex-row lg:justify-between px-8 mt-10 lg:mt-0">
      <div className="w-32 lg:hidden">
        <LogoSVG />
      </div>
      <div className="flex items-center relative w-fit lg:w-80 mt-4 lg:mt-0">
        <HelpButton />
        <ThemeSwitch />
        <LoginButton />
      </div>
    </div>
  );
};

export default Header;
