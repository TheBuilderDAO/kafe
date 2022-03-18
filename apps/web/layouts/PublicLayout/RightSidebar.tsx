import React from 'react';

const RightSidebar = ({ children }) => {
  return (
    <div className="min-w-[350px] mr-20">
      <div className="dark:bg-kafedarker bg-kafelighter rounded-2xl ml-10 text-sm min-w-[350px] max-w-[400px] h-fit sticky top-10">
        {children}
      </div>
    </div>
  );
};

export default RightSidebar;
