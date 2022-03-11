import Link from 'next/link';
import React from 'react';
import Navigation from './Navigation';

const LeftSidebar = props => {
  return (
    <div className="w-full">
      <Navigation />
    </div>
  );
};

export default LeftSidebar;
