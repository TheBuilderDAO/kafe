import React from 'react';

const WriteFormWrapper = ({ children, handleSubmit, onSubmit }) => {
  return (
    <form
      className="flex items-start justify-between w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      {children}
    </form>
  );
};

export default WriteFormWrapper;
