import React from 'react';
import tw from 'tailwind-styled-components';

const Wrapper = ({ children }) => {
  const StyledDiv = tw.div`
        bg-kafewhite
        text-kafeblack
        dark:bg-kafeblack 
        dark:text-kafewhite
        p-8
        flex flex-col
        min-h-screen
        min-w-screen
    `;
  return (
    <StyledDiv>
      <div>{children}</div>
    </StyledDiv>
  );
};

export default Wrapper;
