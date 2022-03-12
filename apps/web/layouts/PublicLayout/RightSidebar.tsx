import React from 'react';

const RightSidebar = ({ children }) => {
  return (
    <div className="dark:bg-kafedarker bg-kafelighter rounded-2xl p-10 ml-10 text-sm min-w-[350px] max-w-[400px]">
      {children}
    </div>
  );
};

export default RightSidebar;
