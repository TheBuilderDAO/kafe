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
        <title>Guide proposal - {tutorial.title}</title>
      </Head>
      <main className="flex lg:flex-row flex-col-reverse lg:mx-0 gap-10 z-10 w-full text-kafeblack dark:text-kafewhite mt-10 mb-40">
        <div className="xl:max-w-3xl xl:min-w-3xl grow relative z-10 mx-8 lg:mx-0 h-fit min-h-[300px]">
          <BorderSVG />
          <section className="p-8">
            <div className="flex mb-8 items-center">
              <p>Proposal by </p> <UserAvatar address={tutorial.creator} />{' '}
              <p className="text-sm text-kafemellow ml-8">
                {' '}
                {new Date(tutorial.createdAt).toLocaleDateString()}
              </p>
            </div>

            <h1 className="lg:text-5xl text-3xl mb-4 font-larken">
              {tutorial.title}
            </h1>

            <Tags tags={tutorial.tags} />
            <p className="break-all">{tutorial.description}</p>
          </section>
        </div>
        <div className="mx-8 lg:mx-0 sticky">
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
