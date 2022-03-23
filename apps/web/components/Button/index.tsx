import React from 'react';
import tw from 'tailwind-styled-components';

const Button = props => {
  const { handleClick, children } = props;

  const StyledButton = tw.button`
            dark:bg-kafedarker
            bg-kafelighter
            flex items-center
            rounded-full
            p-4
            w-12
            h-12
            hover:bg-kafeblack
            dark:hover:bg-kafelighter
            dark:fill-kafewhite
            fill-kafeblack
            hover:fill-kafewhite
            dark:hover:fill-kafeblack
    `;

  return <StyledButton onClick={handleClick}>{children}</StyledButton>;
};

export default Button;
