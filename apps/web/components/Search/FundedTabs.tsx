import { connectRefinementList } from 'react-instantsearch-dom';
import React from 'react';
import { ProposalStateE } from '@builderdao-sdk/dao-program';

const FundedTabs = ({ currentRefinement, refine, createURL }) => {
  return (
    <div>
      <label key="current" htmlFor="current" className="cursor-pointer">
        <input
          type="radio"
          id="current"
          name="fundedTabs"
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
            px-2
            border-[1px]
            rounded-md
            ${
              currentRefinement[0] === 'submitted'
                ? 'dark:bg-kafewhite bg:kafeblack text-kafewhite dark:text-kafeblack'
                : null
            }
            text-[12px]
            mr-4
            `}
        >
          Current
        </span>
      </label>
      <label key="funded" htmlFor="funded" className="cursor-pointer">
        <input
          type="radio"
          id="funded"
          name="fundedTabs"
          value="funded"
          className="peer absolute opacity-0 cursor-pointer"
          onChange={event => {
            event.preventDefault();
            refine(ProposalStateE.funded);
          }}
        />
        <span
          className={`
            p-1
            px-2
            border-[1px]
            rounded-md
                        ${
                          currentRefinement[0] === 'funded'
                            ? 'dark:bg-kafewhite bg:kafeblack text-kafewhite dark:text-kafeblack'
                            : null
                        }
            text-[12px]
            mr-4
            `}
        >
          Funded
        </span>
      </label>
    </div>
  );
};

export default connectRefinementList(FundedTabs);
