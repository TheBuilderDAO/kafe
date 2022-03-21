import { connectRefinementList } from 'react-instantsearch-dom';
import React from 'react';
import { ProposalStateE } from '@builderdao-sdk/dao-program';

const ProposalStateTabs = ({ currentRefinement, refine, createURL }) => {
  return (
    <div>
      <label key="current" htmlFor="current" className="cursor-pointer">
        <input
          type="radio"
          id="current"
          name="ProposalStateTabs"
          value="current"
          className="peer absolute opacity-0 cursor-pointer"
          onChange={event => {
            event.preventDefault();
            refine(ProposalStateE.submitted);
          }}
        />
        <span
          className={`
            p-1
            px-4
            py-2
            rounded-xl
            font-space
            bg-none
            ${
              currentRefinement[0] === 'submitted'
                ? 'dark:bg-kafelighter font-space-italic bg-kafedarker text-kafewhite dark:text-kafeblack'
                : null
            }
            text-[12px]
            mr-6
            `}
        >
          current
        </span>
      </label>
      <label key="funded" htmlFor="funded" className="cursor-pointer">
        <input
          type="radio"
          id="funded"
          name="ProposalStateTabs"
          value="funded"
          className="peer absolute opacity-0 cursor-pointer"
          onChange={event => {
            event.preventDefault();
            refine(ProposalStateE.funded);
          }}
        />
        <span
          className={`
            px-4
            py-2
            rounded-xl
            h-10
            bg-none
            font-space
                        ${
                          currentRefinement[0] === 'funded'
                            ? 'dark:bg-kafelighter bg-kafedarker  font-space-italic text-kafewhite dark:text-kafeblack'
                            : null
                        }
            text-[12px]
            mr-4
            `}
        >
          funded
        </span>
      </label>
    </div>
  );
};

export default connectRefinementList(ProposalStateTabs);
