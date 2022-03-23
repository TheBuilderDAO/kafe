import React from 'react';
import toast from 'react-hot-toast';

const WriteFormWrapper = ({ children, handleSubmit, onSubmit }) => {
  const onError = () => {
    toast.error('Please fill out all form fields');
  };

  return (
    <form
      className="flex flex-col lg:flex-row lg:justify-between text-kafeblack dark:text-kafewhite lg:-mt-10 mt-10 px-4 mb-32 lg:mb-0"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      {children}
    </form>
  );
};

export default WriteFormWrapper;
