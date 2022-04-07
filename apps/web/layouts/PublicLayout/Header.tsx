import React from 'react';
import LoginButton from '@app/components/LoginButton/LoginButton';
import ThemeSwitch from '../../components/Button/ThemeSwitch';
import HelpButton from '../../components/Button/HelpButton';

const Header = () => {
  return (
    <div className="mt-0 flex justify-end w-full">
      <div className="w-menu flex justify-between">
        <div className="mr-1">
          <HelpButton />
        </div>
        <div className="grow">
          <div className="mr-1">
            <ThemeSwitch />
          </div>
        </div>
        <LoginButton />
      </div>
    </div>
  );
};

export default Header;
