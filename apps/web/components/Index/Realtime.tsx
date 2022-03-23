import React from 'react';
import ImageStack from '@app/components/ImageStack';

const Realtime = () => {
  return (
    <>
      <div className="flex justify-between w-64 items-center mb-4">
        <ImageStack addresses={['1']} />
        <span className="text-xs font-bold">
          <p>eskimo.sol published</p>
          <p className="text-kafemellow">Run a Celo node in a virtua...</p>
        </span>
      </div>
      <div className="flex justify-between w-64 items-center mb-4">
        <ImageStack addresses={['1']} />
        <span className="text-xs font-bold">
          <p>eskimo.sol published</p>
          <p className="text-kafemellow">Run a Celo node in a virtua...</p>
        </span>
      </div>
      <div className="flex justify-between w-64 items-center mb-4">
        <ImageStack addresses={['1']} />
        <span className="text-xs font-bold">
          <p>eskimo.sol published</p>
          <p className="text-kafemellow">Run a Celo node in a virtua...</p>
        </span>
      </div>
      <div className="flex justify-between w-64 items-center mb-4">
        <ImageStack addresses={['1']} />
        <span className="text-xs font-bold">
          <p>eskimo.sol published</p>
          <p className="text-kafemellow">Run a Celo node in a virtua...</p>
        </span>
      </div>
    </>
  );
};

export default Realtime;
