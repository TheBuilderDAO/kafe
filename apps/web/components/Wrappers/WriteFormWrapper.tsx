import React from 'react';
import toast from 'react-hot-toast';

const WriteFormWrapper = ({ children, handleSubmit, onSubmit }) => {
  const onError = () => {
    toast.error('Please fill out all form fields');
  };

  return (
    <form
      className="flex items-start justify-between w-full mb-40"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      {children}
    </form>
  );
};

export default WriteFormWrapper;
