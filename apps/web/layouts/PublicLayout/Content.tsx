import React, { ReactNode } from 'react';

type ContentProps = {
  children: ReactNode;
};

const Content = (props: ContentProps) => {
  const { children } = props;

  return (
    <div>{children}</div>
  );
};

export default Content;
