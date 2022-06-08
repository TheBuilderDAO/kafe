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
    <div
      className="flex flex-wrap min-h-screen font-space p-9 relative
     bg-kafewhite dark:text-kafewhite dark:bg-kafeblack tracking-wider mx-auto leading-relaxed"
    >
      <Notifications />
      <Wrapper>
        <div className="grid grid-cols-12">
          <div className="z-20 col-span-1">
            <AlphaBadge />
            <LeftSidebar />
          </div>
          <div className="min-w-full col-span-11 md:col-span-9 ml-0 lg:ml-8">
            <div className="sticky z-10 top-10">
              <Header />
            </div>
            <Content>{children}</Content>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};
const AlphaBadge = () => {
  return (
    <div className="fixed top-0 z-50 px-2 py-1 text-[11px] bg-kafepurple">
      alpha
    </div>
  );
};
export default PublicLayout;
