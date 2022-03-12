import React from 'react';
import Image from 'next/image';

const ImageStack = ({ images }) => {
  const size = 40;
  return (
    <div className="flex flex-row-reverse mr-8">
      {images.map(image => (
        <div
          className={`-mr-6 shadow:md border-[0.5px] w-[${size}px] h-[${size}px] rounded-full dark:border-kafeblack border-kafewhite shadow:xl hover:scale-110`}
          key={image.image.src}
        >
          <Image
            src={image.image}
            key={image.image}
            width={size}
            height={size}
            alt="stack"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageStack;
