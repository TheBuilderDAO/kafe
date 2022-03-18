import React from 'react';
import LoginButton from '@app/components/LoginButton/LoginButton';
import ThemeSwitch from '../../components/Button/ThemeSwitch';
import HelpButton from '../../components/Button/HelpButton';
import Banner from '@app/components/Banner';
import LogoSVG from '../../components/SVG/LogoSVG';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();
  return (
    <div className="h-28 w-full">
      <div className="flex justify-between text-sm w-screen min-w-[1200px] fixed pr-20 z-0">
        <div>
          <LogoSVG />
        </div>
        <div className="flex items-center w-2/5">
          {router.pathname === '/vote' && (
            <Banner
              header="Upvote proposals you want to see get written."
              description="Once a proposal gets 100 votes it will be funded by the community."
              link="https://figment.io"
            />
          )}
          {router.pathname === '/learn' && (
            <Banner
              header="Learm from guides written by our community"
              description="If you like a guide, you can support the creators by tipping"
              link="https://figment.io"
            />
          )}
        </div>
        <div className="flex items-center">
          <HelpButton />
          <ThemeSwitch />
          <LoginButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
