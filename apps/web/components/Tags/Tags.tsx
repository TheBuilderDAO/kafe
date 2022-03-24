import React from 'react';

interface Props {
  tags: string[] | { value: string }[];
  max?: number;
}

const Tags: React.FC<Props> = ({ tags, max = 4 }) => {
  return (
    <span
      className={`relative flex flex-row flex-wrap ${
        tags.length > max ? 'cursor-pointer' : 'cursor-auto'
      } group`}
    >
      {tags.map((tag, index) => (
        <span key={`tag-${index}`}>
          {tags.length > max && index === max ? (
            <span className="my-auto text-xs transition duration-300 ease-in opacity-75 group-hover:opacity-0 group-hover:hidden text-kafeblack dark:text-kafewhite ">
              +{tags.length - max}
            </span>
          ) : null}
          <span
            key={tag}
            className={`${
              index >= max
                ? 'opacity-0  group-hover:opacity-100 group-hover:block'
                : ''
            } inline-flex items-center px-2 py-0 m-2 ml-0 rounded-sm text-[10px] font-extralight dark:bg-[#2A2829] text-kafeblack dark:text-kafewhite bg-kafelighter transition ease-in duration-400`}
          >
            {tag?.value?.toUpperCase() || tag?.toUpperCase()}
          </span>
        </span>
      ))}
    </span>
  );
};

export default Tags;
