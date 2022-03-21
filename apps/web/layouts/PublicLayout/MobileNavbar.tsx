import React from 'react';
import Navigation from './Navigation';
import DAOSVG from '@app/components/SVG/DAOSVG';

const MobileNavbar = () => {
  return (
    <div className="fixed w-screen bottom-0 left-0 right-0 bg-kafewhite dark:bg-kafeblack h-20 content-center text-center drop-shadow-2xl">
      <Navigation />
      <a className="fixed bottom-10 left-10 hidden" href="#">
        <DAOSVG />
      </a>
    </div>
  );
};

export default MobileNavbar;
