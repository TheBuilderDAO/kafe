import React from 'react';
import Image from 'next/image';
import logo from './logo.png';

export const Navbar: React.FC = ({ children }) => (
  <div className="block bg-gray-700">
    <div className="px-20">
      <div className="p-2">
        <Image src={logo} width={200} height={40} />
      </div>
    </div>
    <div>{children}</div>
  </div>
);
