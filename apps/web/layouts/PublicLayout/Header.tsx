import React from 'react';
import LoginButton from '@app/components/LoginButton/LoginButton';
import ThemeSwitch from '../../components/Button/ThemeSwitch';
import HelpButton from '../../components/Button/HelpButton';
import HighlightSVG from '../../components/SVG/Highlight';
import LogoSVG from '../../components/SVG/LogoSVG';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();
  return (
    <div className="flex justify-between w-full text-sm">
      <div>
        <LogoSVG />
      </div>
      {router.pathname === '/vote' ? (
        <div className="flex flex-col justify-center w-1/3">
          <HighlightSVG />
          <div>
            <p className="font-black">
              Upvote proposals you want to see get written.
            </p>
            <p>
              Once a proposal gets 100 votes it will be funded by the community.{' '}
              <a className="underline">Learn more</a>
            </p>
          </div>
        </div>
      ) : null}
      <div className="flex items-center">
        <HelpButton />
        <ThemeSwitch />
        <LoginButton />
      </div>
    </div>
  );
};

export default Header;
