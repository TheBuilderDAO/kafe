import React, { ReactElement } from 'react';
import LeftSidebar from './LeftSidebar';
import Header from './Header';
import Content from './Content';
import { useGetDaoState } from '@builderdao/use-program-tutorial';
import Wrapper from './Wrapper';
import { Notifications } from '@app/components/Notifications/Notifications';
import coffeeFull from '/public/assets/icons/coffee_cup_vote_complete.svg';
import Image from 'next/image';
import Link from 'next/link';
import routes from 'routes';
import usePageLoadingProgress from '../../hooks/usePageLoadingProgress';

type PublicLayoutProps = {
  children: ReactElement;
};
const PublicLayout = (props: PublicLayoutProps) => {
  const { children } = props;
  usePageLoadingProgress();
  const { daoState, error } = useGetDaoState();

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen text-xs tracking-wide bg-kafewhite text-kafeblack dark:bg-kafeblack dark:text-kafewhite font-larken">
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
    <div className="flex flex-wrap min-h-screen font-space p-9 relative bg-kafewhite dark:text-kafewhite dark:bg-kafeblack min-w-[1100px] tracking-wider mx-auto leading-relaxed">
      <Notifications />
      <Wrapper>
        <div className="grid grid-cols-12">
          <div className="col-span-1 z-10">
            <LeftSidebar />
          </div>
          <div className="col-span-11 lg:ml-8 ml-0 min-w-full">
            <div className="sticky top-10 z-10">
              <Header />
            </div>
            <div className="ml-4">
              <Content>{children}</Content>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default PublicLayout;
