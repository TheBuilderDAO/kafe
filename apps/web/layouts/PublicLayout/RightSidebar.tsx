import React from 'react';

const RightSidebar = ({ children }) => {
  return (
    <div className="dark:bg-kafedarker bg-kafelighter rounded-2xl ml-10 text-sm w-96 max-w-96 h-fit sticky top-10">
      {children}
    </div>
  );
};

export default RightSidebar;
