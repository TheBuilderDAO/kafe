import React, { useState } from 'react';
import TagsModal from '@app/components/Modal/TagsModal';

const Tags = props => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  let { tags, overrideLengthCheck = false } = props;
  let shortenedTags;
  let leftOverCount = 0;

  const openModal = () => {
    setModalIsOpen(true);
    console.log('not with me');
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (tags.length > 6) {
    shortenedTags = [...tags].slice(0, 6);
    leftOverCount = tags.length - shortenedTags.length;
  }

  return (
    <span>
      {(!shortenedTags || !!overrideLengthCheck) &&
        tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0 m-2 ml-0 rounded-sm text-[10px] font-extralight dark:bg-[#2A2829] text-kafeblack dark:text-kafewhite bg-kafelighter"
          >
            {tag?.value?.toUpperCase() || tag?.toUpperCase()}
          </span>
        ))}
      {shortenedTags && !overrideLengthCheck && (
        <span>
          {shortenedTags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0 m-2 ml-0 rounded-sm text-[10px] font-extralight dark:bg-[#2A2829] text-kafeblack dark:text-kafewhite bg-kafelighter"
            >
              {tag?.value?.toUpperCase() || tag?.toUpperCase()}
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
