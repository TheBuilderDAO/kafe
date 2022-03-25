import { IconContext } from 'react-icons';
import { VscTriangleRight } from 'react-icons/vsc';
import React from 'react';

type ButtonRightProps = {
  onClick: () => void;
};

const ButtonRight = (props: ButtonRightProps) => {
  const { onClick } = props;
  return (
    <div
      className="absolute left-[490px] top-1/2 cursor-pointer group dark:hover:bg-kafewhite hover:bg-kafeblack w-16 h-16 rounded-full dark:bg-kafedarker bg-kafelighter"
      onClick={onClick}
    >
      <IconContext.Provider
        value={{
          className:
            'text-kafeblack group-hover:text-kafewhite dark:group-hover:text-kafeblack mx-auto mt-5 mr-4 dark:text-kafewhite w-6 h-6',
        }}
      >
        <VscTriangleRight />
      </IconContext.Provider>
    </div>
  );
};

export default ButtonRight;
