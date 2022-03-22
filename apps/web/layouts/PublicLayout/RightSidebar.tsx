import React from 'react';

const RightSidebar = ({ children }) => {
  return (
    <div className="dark:bg-kafedarker bg-kafelighter ml-10 rounded-2xl text-sm w-menu mt-0 h-fit sticky top-28">
      {children}
    </div>
  );
};

export default RightSidebar;
