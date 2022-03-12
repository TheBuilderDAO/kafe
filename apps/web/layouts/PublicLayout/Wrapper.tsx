import React from 'react';
import tw from 'tailwind-styled-components';

const Wrapper = ({ children }) => {
  const StyledDiv = tw.div`
  min-h-screen
  mx-auto
  min-w-[1200px]
  max-w-[1500px]
    `;
  return (
    <StyledDiv>
      <div>{children}</div>
    </StyledDiv>
  );
};

export default Wrapper;
