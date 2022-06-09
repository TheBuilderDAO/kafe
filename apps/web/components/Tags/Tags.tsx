import React, { useState } from 'react';
import TagsModal from '@app/components/Modal/TagsModal';

interface TagsProps {
  tags: string[] | { value: string }[];
  overrideLengthCheck?: boolean;
}

const Tags: React.FC<TagsProps> = props => {
  let { tags, overrideLengthCheck = false } = props;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  let shortenedTags;
  let leftOverCount = 0;

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (tags.length > 6) {
    shortenedTags = [...tags].slice(0, 6);
    leftOverCount = tags.length - shortenedTags.length;
  }
  const getTagValue = tag => {
    return tag?.value?.toUpperCase() || tag?.toUpperCase();
  };
  return (
    <span className="flex flex-wrap">
      {(!shortenedTags || !!overrideLengthCheck) &&
        tags.map((tag, index) => (
          <span
            key={`tag-${index}-${getTagValue(tag).toLowerCase()}`}
            className="inline-flex items-center px-2 py-0 m-2 ml-0 rounded-sm text-[10px] font-extralight dark:bg-[#2A2829] text-kafeblack dark:text-kafewhite bg-kafelighter"
          >
            {getTagValue(tag)}
          </span>
        ))}
      {shortenedTags && !overrideLengthCheck && (
        <span>
          {shortenedTags.map((tag, index) => (
            <span
              key={`tag-${index}-${getTagValue(tag).toLowerCase()}`}
              className="inline-flex items-center px-2 py-0 m-2 ml-0 rounded-sm text-[10px] font-extralight dark:bg-[#2A2829] text-kafeblack dark:text-kafewhite bg-kafelighter"
            >
              {getTagValue(tag)}
            </span>
          ))}
          <p
            className="inline-flex items-center px-2 py-0 m-2 ml-0 rounded-sm text-[10px] font-extralight dark:bg-[#2A2829] text-kafered cursor-pointer dark:text-kafegold bg-kafelighter"
            onClick={openModal}
          >
            +{leftOverCount}
          </p>
        </span>
      )}
      <TagsModal
        tags={tags}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
      />
    </span>
  );
};

export default Tags;
