import React from 'react';

const RightSidebar = ({ children }) => {
  return (
    <div className="dark:bg-kafedarker bg-kafelighter rounded-2xl ml-10 text-sm w-[400px] max-w-[400px] h-fit">
      {children}
    </div>
  );
};

export default RightSidebar;
