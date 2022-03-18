import React from 'react';
import LoginButton from '@app/components/LoginButton/LoginButton';
import ThemeSwitch from '../../components/Button/ThemeSwitch';
import HelpButton from '../../components/Button/HelpButton';

const Header = () => {
  return (
    <div className="absolute right-8 flex items-center top-4 w-96 justify-between">
      <HelpButton />
      <ThemeSwitch />
      <LoginButton />
    </div>
  );
};

export default Header;
