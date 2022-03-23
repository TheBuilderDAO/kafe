import React from 'react';

const Tags = (props): JSX.Element => {
  let { tags } = props;

  return (
    <span>
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center px-2 py-0 m-2 ml-0 rounded-sm text-[10px] font-extralight dark:bg-[#2A2829] text-kafeblack dark:text-kafewhite bg-kafelighter"
        >
          {tag?.value?.toUpperCase() || tag.toUpperCase()}
        </span>
      ))}
    </span>
  );
};

export default Tags;
