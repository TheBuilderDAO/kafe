import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="w-full flex justify-center items-center">
      <p>{message}</p>
    </div>
  );
};

export default Loader;
