import React from 'react';

const BorderSVG = () => {
  return (
    <svg
      width="100%"
      height="100%"
      className="absolute stroke-kafeblack dark:stroke-kafewhite stroke-2 -z-10 dark:fill-kafeblack fill-kafewhite shadow-2xl rounded-[35px]"
    >
      <rect width="100%" height="100%" rx="34.5" strokeDasharray="1 5" />
    </svg>
  );
};

export default BorderSVG;
