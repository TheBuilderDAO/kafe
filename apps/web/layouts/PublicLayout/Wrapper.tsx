import React from 'react';
import tw from 'tailwind-styled-components';

const Wrapper = ({ children }) => {
  const StyledDiv = tw.div`
  p-8
  dark:bg-kafeblack
  bg-kafewhite
  mx-auto
  min-w-[1200px]
  max-w-[1500px]
    `;

  return <StyledDiv>{children}</StyledDiv>;
};

export default Wrapper;
