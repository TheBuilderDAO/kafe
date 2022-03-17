import React from 'react';
import tw from 'tailwind-styled-components';

const Wrapper = ({ children }) => {
  const StyledDiv = tw.div`
  p-8
  dark:bg-kafeblack
  bg-kafewhite
  mx-auto
  min-h-screen
  w-full
  overflow-auto
    `;

  return (
    <StyledDiv>
      <div>{children}</div>
    </StyledDiv>
  );
};

export default Wrapper;
