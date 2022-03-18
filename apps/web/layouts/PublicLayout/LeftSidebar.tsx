import React from 'react';
import Navigation from './Navigation';
import Image from 'next/image';
import DAO from 'public/assets/icons/dao.svg';

const LeftSidebar = () => {
  return (
    <div className="w-40">
      <Navigation />
      <div className="fixed bottom-10 left-12">
        <Image src={DAO} width={130} height={100} alt="builder dao icon" />
      </div>
    </div>
  );
};

export default LeftSidebar;
