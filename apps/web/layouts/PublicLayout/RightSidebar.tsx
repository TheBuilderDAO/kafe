import React from 'react';

const RightSidebar = ({ children }) => {
  return (
    <div className="mt-10 ml-3 text-sm dark:bg-kafedarker bg-kafelighter rounded-2xl w-menu h-fit ">
      {children}
    </div>
  );
};

export default RightSidebar;
