import React, { ReactElement } from 'react';
import LeftSidebar from './LeftSidebar';
import Header from './Header';
import Content from './Content';
import { useGetDaoState } from '@builderdao-sdk/dao-program';
import Wrapper from './Wrapper';
import { Notifications } from '@app/components/Notifications/Notifications';
import coffeeFull from '/public/assets/icons/coffee_cup_vote_complete.svg';
import Image from 'next/image';
import Link from 'next/link';
import routes from 'routes';

type PublicLayoutProps = {
  children: ReactElement;
};
const PublicLayout = (props: PublicLayoutProps) => {
  const { children } = props;
  const { daoState, error } = useGetDaoState();

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen text-2xl tracking-wide bg-kafewhite text-kafeblack dark:bg-kafeblack dark:text-kafewhite font-larken">
        <div>
          <Image src={coffeeFull} width={60} height={60} alt="err" />
          <p>Aw, nuts. Something&rsquo;s up. </p>
          <p>
            Check your internet connection and{' '}
            <span className="text-kafered hover:text-kafegold hover:cursor-pointer">
              <Link href={routes.home}>try again?</Link>
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex p-8 bg-kafewhite dark:bg-kafeblack">
      <Notifications />
      <Wrapper>
        <div className="flex">
          <Header />
        </div>
        <div className="grid grid-cols-12">
          <div className="sticky col-span-2 max-content">
            <LeftSidebar />
          </div>
          <div className="col-span-2 w-minimum">
            <Content>{children}</Content>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default PublicLayout;
