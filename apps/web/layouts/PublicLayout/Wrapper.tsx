import React from 'react';
import tw from 'tailwind-styled-components';

const Wrapper = ({ children }) => {
  const StyledDiv = tw.div`
  px-2
  pt-0
  dark:bg-kafeblack
  bg-kafewhite
  mx-auto
  min-w-[1200px]
  max-w-[1500px]
  relative
    `;

  return <StyledDiv>{children}</StyledDiv>;
};

export default Wrapper;
