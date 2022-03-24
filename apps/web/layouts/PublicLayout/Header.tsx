import React from 'react';
import LoginButton from '@app/components/LoginButton/LoginButton';
import ThemeSwitch from '../../components/Button/ThemeSwitch';
import HelpButton from '../../components/Button/HelpButton';

const Header = () => {
  return (
    <div className="mt-0 flex justify-end w-full">
      <div className="w-menu flex justify-between">
        <HelpButton />
        <div className="mx-6">
          <ThemeSwitch />
        </div>
        <LoginButton />
      </div>
    </div>
  );
};

export default Header;
