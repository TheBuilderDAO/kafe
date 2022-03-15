import React from 'react';

const Tags = (props): JSX.Element => {
  let { tags } = props;
  tags = tags.map(tag => (tag.value ? tag.value : tag));

  return (
    <span>
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center px-4 py-1.5 mr-2 rounded-sm text-xs font-extralight dark:bg-[#2A2829] text-kafeblack dark:text-kafewhite bg-kafelighter"
        >
          {tag?.value || tag}
        </span>
      ))}
    </span>
  );
};

export default Tags;
