import React from 'react';
import HighlightSVG from './SVG/Highlight';

const Banner = ({ header, description, link }) => {
  return (
    <div className="flex flex-col justify-center w-1/3">
      <HighlightSVG />
      <div>
        <p className="font-black">{header}</p>
        <p>
          {description}{' '}
          <a className="underline" href={link}>
            Learn more
          </a>
        </p>
      </div>
    </div>
  );
};

export default Banner;
