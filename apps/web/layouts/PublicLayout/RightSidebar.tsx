import React from 'react';

const RightSidebar = ({ children }) => {
  return (
    <div className="mt-10 md:ml-6 text-sm dark:bg-kafedarker bg-kafelighter rounded-2xl h-fit w-full md:max-w-[294px]">
      {children}
    </div>
  );
};

export default RightSidebar;
