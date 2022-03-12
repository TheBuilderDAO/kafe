/* eslint-disable react/display-name */
import React from 'react';

const InputTitle = React.forwardRef(({ placeholder }, ref) => {
  return (
    <input
      className="p-0 pt-2 mb-16  focus:ring-0 font-larken text-6xl block w-full dark:bg-kafeblack bg-kafewhite border-none rounded-md text-kafeblack dark:text-kafewhite placeholder:text-[#474443]"
      type="text"
      placeholder={placeholder}
    />
  );
});

export default InputTitle;
