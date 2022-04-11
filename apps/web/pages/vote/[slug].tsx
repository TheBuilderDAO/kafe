import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import React, { PropsWithChildren } from 'react';
import Tags from '@app/components/Tags/Tags';
import { getApplicationFetcher } from '../../hooks/useDapp';
import { unstable_serialize } from 'swr';
import routes from '../../routes';
import { useGetTutorialBySlugWithMetadata } from 'services/ApplicationFetcher';
import TutorialProposalVotes from '@app/components/TutorialProposalVotes/TutorialProposalVotes';
import { ProposalStateE, useGetReviewer } from '@builderdao-sdk/dao-program';
import { PublicKey } from '@solana/web3.js';
import { ZERO_ADDRESS } from '../../constants';
import UserAvatar from '@app/components/UserAvatar/UserAvatar';
import BorderSVG from '@app/components/SVG/BorderSVG';
import RightSidebar from '../../layouts/PublicLayout/RightSidebar';
import Loader from '@app/components/Loader/Loader';
import WriteOnGitHub from '@app/components/Admin/WriteOnGithub';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import { formatUnix } from '@app/lib/utils/format-date';
type PageProps = {
  tutorial: any;
};

const Tutorial: NextPage = (props: PropsWithChildren<PageProps>) => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: tutorial } = useGetTutorialBySlugWithMetadata(slug as string);

  return (
    <div>
      <Head>
        <title>Kafé by Builder DAO - Proposal for {tutorial.title}</title>
      </Head>
      <main className="flex flex-row mx-0 gap-10 z-10 w-full text-kafeblack dark:text-kafewhite mt-10 mb-40 text-xs justify-between">
        <div className="max-w-3xl min-w-3xl grow relative z-10 mx-0 h-fit min-h-[300px] mt-12">
          <BorderSVG />
          <section className="p-8">
            <div className="flex mb-8 items-center">
              <p className="mr-2">Proposal by </p>{' '}
              <UserAvatar address={tutorial.creator} />{' '}
              <p className="text-sm dark:text-kafemellow text-kafeblack ml-8">
                {' '}
                {formatUnix(tutorial.createdAt)}
              </p>
            </div>

            <h1 className="text-5xl mb-4 font-larken tracking-wider leading-2">
              {tutorial.title}
            </h1>

            <Tags tags={tutorial.tags} overrideLengthCheck={true} />
            <p className="mt-4 leading-6 text-md">{tutorial.description}</p>
          </section>
        </div>
        <div className="mx-0 sticky">
          <div>
            <RightSidebar>
              <div className="p-6">
                <TutorialProposalVotes
                  id={tutorial.id}
                  state={tutorial.state as ProposalStateE}
                />
              </div>
            </RightSidebar>
            <IsLoggedIn>
              <WriteOnGitHub
                tutorial={tutorial}
                RenderReviewer={RenderReviewer}
              />
            </IsLoggedIn>
          </div>
        </div>
      </main>
    </div>
  );
};

const RenderReviewer = (props: { pubkey: string; number: string }) => {
  const { pubkey, number } = props;
  const { reviewer, loading, error } = useGetReviewer(new PublicKey(pubkey));

  return (
    <div className="py-2  sm:grid sm:grid-cols-3 sm:gap-4">
      <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
        {loading ? (
          <Loader />
        ) : (
          <div className="-mx-2">
            <UserAvatar
              address={reviewer.githubName.toString()}
              ellipsis={false}
            />
          </div>
        )}
      </dd>
    </div>
  );
};

// TODO: Using getServerSideProps for now. Use getStaticPaths and getStaticProps
export async function getServerSideProps(context) {
  const { slug } = context.params;

  const fetcher = getApplicationFetcher();

  const tutorial = await fetcher.getTutorialBySlug(slug);

  return {
    props: {
      fallback: {
        [unstable_serialize(routes.fetchers.tutorials.getBySlug(slug))]:
          tutorial,
      },
    },
  };
}

export default Tutorial;
