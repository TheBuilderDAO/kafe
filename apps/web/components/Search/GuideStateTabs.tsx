import React from 'react'
import { connectRefinementList } from 'react-instantsearch-dom'
import { ProposalStateE } from '@builderdao-sdk/dao-program'

const GuideStateTabs = ({
  currentRefinement,
  refine,
  createURL,
}) => {
  return (
    <div>
      <label key="current" htmlFor="published" className="cursor-pointer">
        <input
          type="radio"
          id="published"
          name="GuideStateTabs"
          value="published"
          className="peer absolute opacity-0 cursor-pointer"
          onChange={event => {
            event.preventDefault()
            refine(ProposalStateE.published)
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
            Published
          </span>
      </label>
      <label key="readyToPublish" htmlFor="readyToPublish" className="cursor-pointer">
        <input
          type="radio"
          id="readyToPublish"
          name="GuideStateTabs"
          value="readyToPublish"
          className="peer absolute opacity-0 cursor-pointer"
          onChange={event => {
            event.preventDefault()
            refine(ProposalStateE.readyToPublish)
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
            Ready to publish
          </span>
      </label>
      <label key="writing" htmlFor="writing" className="cursor-pointer">
        <input
          type="radio"
          id="writing"
          name="GuideStateTabs"
          value="writing"
          className="peer absolute opacity-0 cursor-pointer"
          onChange={event => {
            event.preventDefault()
            refine(ProposalStateE.writing)
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
            Writing
          </span>
      </label>
    </div>
  )
}

export default connectRefinementList(GuideStateTabs)
