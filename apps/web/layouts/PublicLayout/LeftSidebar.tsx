import React from 'react';
import Navigation from './Navigation';
import DAOSVG from '@app/components/SVG/DAOSVG';

const LeftSidebar = () => {
  return (
    <div className="sticky w-full top-36">
      <Navigation />
      <a className="fixed bottom-10 left-10" href="#">
        <DAOSVG />
      </a>
    </div>
  );
};

export default LeftSidebar;
