import React from 'react';

export const PageTitle: React.FC = ({ children }) => {
  return (
    <h1 className="text-6xl text-left font-normal leading-9 text-kafeblack dark:text-kafewhite sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 tracking-wide w-11/12">
      {children}
    </h1>
  );
};
