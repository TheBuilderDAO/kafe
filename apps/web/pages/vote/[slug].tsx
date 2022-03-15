import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import React, { PropsWithChildren } from 'react'
import Tags from '@app/components/Tags/Tags'
import { getApplicationFetcher } from '../../hooks/useDapp'
import { unstable_serialize } from 'swr'
import routes from '../../routes'
import AssignReviewersForm from '@app/components/AssignReviewersForm/AssignReviewersForm'
import IsAdmin from '@app/components/IsAdmin/IsAdmin'
import { useGetTutorialBySlugWithMetadata } from 'services/ApplicationFetcher'
import TutorialProposalVotes from '@app/components/TutorialProposalVotes/TutorialProposalVotes'
import { ProposalStateE, useGetReviewer } from '@builderdao-sdk/dao-program'
import { PublicKey } from '@solana/web3.js'
import { addEllipsis } from 'utils/strings'
import { ZERO_ADDRESS } from '../../constants'

type PageProps = {
  tutorial: any;
};

const Tutorial: NextPage = (props: PropsWithChildren<PageProps>) => {
  const router = useRouter()
  const { slug } = router.query

  const { data: tutorial } = useGetTutorialBySlugWithMetadata(slug as string)

  return (
    <div>
      <Head>
        <title>{tutorial.title}</title>
      </Head>

      <main>
        <div className='flex flex-row gap-10'>
          <div className='w-full overflow-hidden bg-white shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:px-6'>
              <h3 className='text-lg font-medium leading-6 text-gray-900'>
                {tutorial.title}
              </h3>
              <p className='max-w-2xl mt-1 text-sm text-gray-500'>
                {tutorial.description}
              </p>
            </div>
            <div className='border-t border-gray-200'>
              <dl>
                <div className='px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>Author</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                    {tutorial.creator}
                  </dd>
                </div>
                <div className='px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>Tags</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                    <Tags tags={tutorial.tags} />
                  </dd>
                </div>
                <div className='px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Difficulty
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                    {tutorial.difficulty}
                  </dd>
                </div>
                <div className='px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Created at
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                    {tutorial.createdAt}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className='w-100'>
            <div className='p-6 mb-6 bg-white shadow sm:rounded-lg'>
              <TutorialProposalVotes id={tutorial.id} />
            </div>
            {(tutorial.state !== ProposalStateE.readyToPublish && tutorial.state !== ProposalStateE.published) && (
              <div className='p-6 bg-white shadow w-60 sm:rounded-lg'>
                {tutorial.reviewer1 !== ZERO_ADDRESS && (
                  <RenderReviewer pubkey={tutorial.reviewer1} />
                )}
                {tutorial.reviewer2 !== ZERO_ADDRESS && (
                  <RenderReviewer pubkey={tutorial.reviewer2} />
                )}
                <IsAdmin>
                  <AssignReviewersForm tutorial={tutorial} />
                </IsAdmin>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

const RenderReviewer = (props: { pubkey: string }) => {
  const { pubkey } = props
  const { reviewer, loading, error } = useGetReviewer(new PublicKey(pubkey))

  return (
    <div className='px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
        {loading ? '...'
          : `${addEllipsis(reviewer.pubkey.toString())} (${reviewer.githubName})`
        }
      </dd>
    </div>
  )
}

// TODO: Using getServerSideProps for now. Use getStaticPaths and getStaticProps
export async function getServerSideProps(context) {
  const { slug } = context.params

  const fetcher = getApplicationFetcher()

  const tutorial = await fetcher.getTutorialBySlug(slug)

  return {
    props: {
      fallback: {
        [unstable_serialize(routes.fetchers.tutorials.getBySlug(slug))]:
        tutorial,
      },
    },
  }
}

export default Tutorial
