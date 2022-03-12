/* eslint-disable react/display-name */
import React from 'react';

const InputCheckbox = React.forwardRef(({ options }, refs) => {
  return options.map(option => (
    <label key={option} htmlFor={option} className="cursor-pointer">
      <input
        type="radio"
        id={option}
        name="radio"
        value={option}
        className="peer absolute opacity-0 cursor-pointer"
      />
      <span
        className="
            p-1
            px-2
            border-[1px]
            rounded-md
            dark:border-kafewhite
            border-kafeblack
            dark:peer-checked:border-kafered
            peer-checked:border-kafepurple
            dark:peer-checked:text-kafered
            peer-checked:text-kafepurple
            peer-hover:border-kafepurple
            dark:peer-hover:border-kafered
            text-[12px]
            mr-4"
      >
        {option}
      </span>
    </label>
  ));
});

export default InputCheckbox;
