import React from 'react';

type CheckboxProps = {
  options: string[];
  name: string;
  inputRef?: any;
  onChange?: any;
};

const InputCheckbox = ({
  options,
  name,
  inputRef,
  onChange,
}: CheckboxProps) => {
  return (
    <>
      {options.map(option => (
        <label key={option} htmlFor={option} className="cursor-pointer">
          <input
            type="radio"
            id={option}
            name={name}
            value={option}
            className="peer absolute opacity-0 cursor-pointer"
            onChange={onChange}
            ref={inputRef}
          />
          <span
            className="
            p-1
            px-2
            border-[1px]
            rounded-md
            dark:border-kafewhite
            border-kafeblack
            dark:peer-checked:border-kafewhite
            peer-checked:border-kafeblack
            dark:peer-checked:text-kafeblack
            peer-checked:text-kafewhite
            dark:peer-checked:bg-kafewhite
            peer-checked:bg-kafeblack
            dark:bg-kafeblack
            bg-kafelighter
            text-[12px]
            mr-4
            "
          >
            {option}
          </span>
        </label>
      ))}
    </>
  );
};

export default InputCheckbox;
