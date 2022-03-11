import React, { ReactElement } from 'react';
import LeftSidebar from './LeftSidebar';
import Header from './Header';
import Content from './Content';
import { useGetDaoState } from '@builderdao-sdk/dao-program';
import Wrapper from './Wrapper';
import RightSidebar from './RightSidebar';
import { Notifications } from '@app/components/Notifications/Notifications';

type PublicLayoutProps = {
  children: ReactElement;
};
const PublicLayout = (props: PublicLayoutProps) => {
  const { children } = props;
  const { daoState, error } = useGetDaoState();

  if (error) {
    console.log(error);
    return (
      <div>
        <code>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </code>
        Error loading global state. Refresh.
      </div>
    );
  }

  return (
    <>
    <Notifications />
    <Wrapper>
      <div className="flex">
        <Header />
      </div>
      <div className="flex">
        <div className="mr-10 max-content">
          <LeftSidebar />
        </div>

        <div className="grow">
          <Content>{children}</Content>
        </div>
      </div>
    </Wrapper>
    </>
  );
};

export default PublicLayout;
