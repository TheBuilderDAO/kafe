import React from 'react';
import KafePassSVG from '../SVG/KafePassSVG';

const WriteSidebar = ({ submitting }) => {
  return (
    <div>
      <p className="font-larken text-xl pb-2">Kafé token</p>
      <p>
        You&apos;ll need 1 Kafé token to submit a proposal.{' '}
        <a href="#">Learn more</a>
      </p>
      <div className="flex justify-center py-4">
        <KafePassSVG />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="items-center px-6 py-4 w-full font-medium dark:text-kafeblack text-kafewhite bg-kafeblack dark:bg-kafegold border border-transparent rounded-3xl shadow-sm hover:bg-kafepurple dark:hover:bg-kafered sm:text-sm"
      >
        {submitting ? 'Submitting...' : 'submit proposal'}
      </button>
    </div>
  );
};

export default WriteSidebar;
