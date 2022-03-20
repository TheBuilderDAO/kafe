import React from 'react';

const RightSidebar = ({ children }) => {
  return (
    <div className="dark:bg-kafedarker bg-kafelighter lg:ml-10 rounded-2xl text-sm lg:w-80 mt-10 lg:mt-0 h-fit lg:sticky top-32 w-full">
      {children}
    </div>
  );
};

export default RightSidebar;
