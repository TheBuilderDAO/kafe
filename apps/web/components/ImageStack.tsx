import React from 'react';
import Image from 'next/image';
import Identicon from 'react-identicons';
import { useTheme } from 'next-themes';

type ImageStackProps = {
  addresses: string[];
  size?: number;
  limit?: number;
};

const ImageStack = (props: ImageStackProps) => {
  const { theme } = useTheme();
  const { addresses, size = 50, limit = 3 } = props;
  const bg = theme === 'dark' ? '#EB5F49' : '#EFBB73';

  return (
    <div className="flex flex-row">
      {addresses.slice(0, limit).map(address => (
        <div
          className={`-mr-3 shadow:md border-[1px] flex w-[25px] h-[25px] rounded-full dark:border-kafeblack border-kafewhite shadow:xl hover:scale-110 overflow-hidden`}
          key={address}
        >
          <Identicon string={address} size={size} bg={bg} />
        </div>
      ))}
    </div>
  );
};

export default ImageStack;
