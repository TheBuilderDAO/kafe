import React from 'react';

const WriteFormWrapper = ({ children, handleSubmit, onSubmit }) => {
  return (
    <form
      className="flex flex-col lg:flex-row lg:justify-between text-kafeblack dark:text-kafewhite lg:-mt-10 mt-10 px-4 mb-32 lg:mb-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      {children}
    </form>
  );
};

export default WriteFormWrapper;
