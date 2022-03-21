import React from 'react';
import LoginButton from '@app/components/LoginButton/LoginButton';
import ThemeSwitch from '../../components/Button/ThemeSwitch';
import HelpButton from '../../components/Button/HelpButton';

const Header = () => {
  return (
    <div className="lg:mt-0 flex lg:justify-end">
      <div className="w-menu flex justify-between">
        <HelpButton />
        <ThemeSwitch />
        <LoginButton />
      </div>
    </div>
  );
};

export default Header;
