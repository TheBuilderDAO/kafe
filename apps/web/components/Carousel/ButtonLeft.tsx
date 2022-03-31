import { IconContext } from 'react-icons';
import { VscTriangleLeft } from 'react-icons/vsc';
import React from 'react';

type ButtonLeftProps = {
  onClick: () => void;
};

const ButtonLeft = (props: ButtonLeftProps) => {
  const { onClick } = props;
  return (
    <div
      className="absolute -left-20 top-1/2 right-0 cursor-pointer dark:hover:bg-kafewhite hover:bg-kafeblack w-16 h-16 rounded-full dark:bg-kafedarker bg-kafelighter group"
      onClick={onClick}
    >
      <IconContext.Provider
        value={{
          className:
            'text-kafeblack group-hover:text-kafewhite dark:group-hover:text-kafeblack mx-auto mt-5 dark:text-kafewhite w-6 h-6',
        }}
      >
        <VscTriangleLeft />
      </IconContext.Provider>
    </div>
  );
};

export default ButtonLeft;
