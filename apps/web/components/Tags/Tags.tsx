import React, { ReactElement } from 'react';

type TagsProps = {
  tags: string[];
};

const Tags = (props: TagsProps): JSX.Element => {
  const { tags } = props;

  return (
    <span>
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center px-4 py-1.5 mr-2 rounded-sm text-xs font-extralight dark:bg-[#2A2829] text-kafewhite dark:text-kafewhite bg-kafeblack"
        >
          {tag.toUpperCase()}
        </span>
      ))}
    </span>
  );
};

export default Tags;
