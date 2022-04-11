import React, { ReactNode } from 'react';

const Content: React.FC = props => {
  const { children } = props;
  return <div>{children}</div>;
};

export default Content;
