import React from 'react';
import KafePassSVG from '../SVG/KafePassSVG';
import LoginButton from '@app/components/LoginButton/LoginButton';
import { useDapp } from '../../hooks/useDapp';

const WriteSidebar = ({ submitting }) => {
  const { wallet } = useDapp();

  return (
    <div className="p-10">
      <p className="pb-2 text-xl font-larken">Kafé token</p>
      <p>
        You&apos;ll need 1 Kafé token to submit a proposal.{' '}
        <a href="https://builderdao.notion.site/How-to-Publish-a-Guide-3193610e39c44de486ec21e0a85b500a">
          Learn more
        </a>
      </p>
      <div className="flex justify-center py-4">
        <KafePassSVG />
      </div>
      <button
        type="submit"
        disabled={submitting || !wallet.connected}
        className="items-center w-full px-6 py-4 font-medium border border-transparent shadow-sm disabled:opacity-25 dark:text-kafeblack text-kafewhite bg-kafeblack dark:bg-kafegold rounded-3xl hover:bg-kafepurple dark:hover:bg-kafered sm:text-sm"
      >
        {submitting ? 'Submitting...' : 'submit proposal'}
      </button>
    </div>
  );
};

export default WriteSidebar;
