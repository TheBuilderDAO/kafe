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
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          {tag}
        </span>
      ))}
    </span>
  );
};

export default Tags;
