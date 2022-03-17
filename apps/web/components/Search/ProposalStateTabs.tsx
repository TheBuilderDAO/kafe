import { connectRefinementList } from 'react-instantsearch-dom'
import React from 'react'
import { ProposalStateE } from '@builderdao-sdk/dao-program'

const ProposalStateTabs = ({
  currentRefinement,
  refine,
  createURL,
}) => {
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
            event.preventDefault()
            refine(ProposalStateE.submitted)
          }}
        />
        <span
          className="
            p-1
            px-2
            border-[1px]
            rounded-md
            dark:border-kafewhite
            border-kafeblack
            dark:peer-checked:border-kafewhite
            peer-checked:border-kafeblack
            dark:peer-checked:text-kafeblack
            peer-checked:text-kafewhite
            dark:peer-checked:bg-kafewhite
            peer-checked:bg-kafeblack
            dark:bg-kafeblack
            bg-kafelighter
            text-[12px]
            mr-4
            "
        >
            Current
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
            event.preventDefault()
            refine(ProposalStateE.funded)
          }}
        />
        <span
          className="
            p-1
            px-2
            border-[1px]
            rounded-md
            dark:border-kafewhite
            border-kafeblack
            dark:peer-checked:border-kafewhite
            peer-checked:border-kafeblack
            dark:peer-checked:text-kafeblack
            peer-checked:text-kafewhite
            dark:peer-checked:bg-kafewhite
            peer-checked:bg-kafeblack
            dark:bg-kafeblack
            bg-kafelighter
            text-[12px]
            mr-4
            "
        >
            Funded
          </span>
      </label>
    </div>
  )
}

export default connectRefinementList(ProposalStateTabs)
