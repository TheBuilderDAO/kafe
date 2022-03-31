import React from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';
import { ProposalStateE } from '@builderdao-sdk/dao-program';

const GuideStateTabs = ({ currentRefinement, refine, createURL }) => {
  return (
    <div>
      <label key="published" htmlFor="published" className="cursor-pointer">
        <input
          type="radio"
          id="published"
          name="ProposalStateTabs"
          value="published"
          className="peer absolute opacity-0 cursor-pointer"
          onChange={event => {
            event.preventDefault();
            refine(ProposalStateE.published);
          }}
        />
        <span
          className={`
            p-1
            px-4
            py-2
            rounded-xl
            font-space
            dark:bg-kafeblack
            bg-kafewhite
            bg-none
            ${
              currentRefinement[0] === ProposalStateE.published
                ? 'dark:bg-kafewhite font-space-italic bg-kafedarker text-kafewhite dark:text-kafeblack'
                : null
            }
            text-[12px]
            mr-4
            `}
        >
          published
        </span>
      </label>
      <label
        key="readyToPublish"
        htmlFor="readyToPublish"
        className="cursor-pointer"
      >
        <input
          type="radio"
          id="readyToPublish"
          name="ProposalStateTabs"
          value="readyToPublish"
          className="peer absolute opacity-0 cursor-pointer"
          onChange={event => {
            event.preventDefault();
            refine(ProposalStateE.readyToPublish);
          }}
        />
        <span
          className={`
            p-1
            px-2
            rounded-md
                        ${
                          currentRefinement[0] === ProposalStateE.readyToPublish
                            ? 'dark:bg-kafewhite bg-kafeblack text-kafewhite dark:text-kafeblack'
                            : null
                        }
            text-[12px]
            mr-4
            `}
        >
          ready to publish
        </span>
      </label>
      <label key="writing" htmlFor="writing" className="cursor-pointer">
        <input
          type="radio"
          id="writing"
          name="ProposalStateTabs"
          value="writing"
          className="peer absolute opacity-0 cursor-pointer"
          onChange={event => {
            event.preventDefault();
            refine(ProposalStateE.writing);
          }}
        />
        <span
          className={`
            p-1
            px-2
            rounded-md
                        ${
                          currentRefinement[0] === ProposalStateE.writing
                            ? 'dark:bg-kafewhite bg-kafeblack text-kafewhite dark:text-kafeblack'
                            : null
                        }
            text-[12px]
            mr-4
            `}
        >
          writing
        </span>
      </label>
    </div>
  );
};

export default connectRefinementList(GuideStateTabs);
