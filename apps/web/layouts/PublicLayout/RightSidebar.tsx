import React from 'react';

const RightSidebar = ({ children }) => {
  return (
    <div className="dark:bg-kafedarker bg-kafelighter rounded-2xl ml-10 text-sm min-w-[350px] max-w-[400px] h-fit sticky top-10">
      {children}
    </div>
  );
};

export default RightSidebar;
