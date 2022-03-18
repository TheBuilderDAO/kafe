import React from 'react';
import LoginButton from '@app/components/LoginButton/LoginButton';
import ThemeSwitch from '../../components/Button/ThemeSwitch';
import HelpButton from '../../components/Button/HelpButton';

const Header = () => {
  return (
    <div className="absolute flex right-0 items-center mr-5">
      <HelpButton />
      <ThemeSwitch />
      <LoginButton />
    </div>
  );
};

export default Header;
