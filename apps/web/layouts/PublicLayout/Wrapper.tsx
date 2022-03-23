import React from 'react';
import tw from 'tailwind-styled-components';

const Wrapper = ({ children }) => {
  const StyledDiv = tw.div`
  pt-0
  mx-auto
  w-full
  bg-kafewhite
  dark:bg-kafeblack
  relative
  max-w-screen-xl
    `;

  return <StyledDiv>{children}</StyledDiv>;
};

export default Wrapper;
