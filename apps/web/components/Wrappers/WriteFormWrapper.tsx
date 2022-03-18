import React from 'react';

const WriteFormWrapper = ({ children, handleSubmit, onSubmit }) => {
  return (
    <form
      className="flex justify-between text-kafeblack dark:text-kafewhite -mt-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      {children}
    </form>
  );
};

export default WriteFormWrapper;
