import React from 'react';
import LoginButton from '@app/components/LoginButton/LoginButton';
import ThemeSwitch from '../../components/Button/ThemeSwitch';
import HelpButton from '../../components/Button/HelpButton';
import { KBarButton } from '@app/components/Button/KBarButton';

const Header = () => {
  return (
    <div className="mt-0 flex sm:justify-end justify-around w-full sm:mt-0">
      <div className="flex justify-between items-center">
        <div className="mr-1">
          <KBarButton />
        </div>
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
