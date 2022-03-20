import React from 'react';

const Tags = (props): JSX.Element => {
  let { tags } = props;

  return (
    <span>
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center px-4 py-1.5 m-2 ml-0 rounded-sm text-xs font-extralight dark:bg-[#2A2829] text-kafeblack dark:text-kafewhite bg-kafelighter"
        >
          {tag?.value || tag}
        </span>
      ))}
    </span>
  );
};

export default Tags;
