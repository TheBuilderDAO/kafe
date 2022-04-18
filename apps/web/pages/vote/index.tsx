import type { NextPage } from 'next';
import Head from 'next/head';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';
import Link from 'next/link';

import TutorialProposalHit from '@app/components/Search/TutorialProposalHit';
import Pagination from '@app/components/Search/Pagination';
import Banner from '@app/components/Banner';
import {
  ProposalStateE,
  useGetListOfProposals,
} from '@builderdao-sdk/dao-program';
import ProposalStateTabs from '@app/components/Search/ProposalStateTabs';

import RightSidebar from '../../layouts/PublicLayout/RightSidebar';
import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
} from '@app/constants';
import TutorialProposalHitFilter from '@app/components/Search/TutorialProposalHitFilter';
import Loader from '@app/components/Loader/Loader';
import useSearchState from '../../hooks/useSearchState';
import TutorialProposalHits from '@app/components/Search/TutorialProposalHits';

const PER_PAGE = 10;

const searchClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
);

const ProposalList = () => {
  const { proposals, loading, error } = useGetListOfProposals();
  if (error) {
    console.error(error);
    return <div>Error: {error.message} </div>;
  }
  if (loading && !error) {
    return <Loader />;
  }
  return (
    <div>
      {proposals.map(proposal => (
        <div key={proposal.publicKey.toString()}>
          <Link href={`/vote/${proposal.account.slug}`}>
            {proposal.account.slug}
          </Link>
        </div>
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const searchStateProps = useSearchState();

  return (
    <div>
      <Head>
        <title>Kafé by Builder DAO - Search Proposals</title>
      </Head>

      <main className="w-full">
        <Banner
          header="Upvote proposals you want to see get written."
          description="Once a proposal gets 100 votes it will be funded by the community."
          link="https://builderdao.notion.site/Kaf-by-Builder-DAO-b46af3ff401448d789288f4b94814e19"
        />
        <div className="z-30 flex mb-20">
          <InstantSearch
            searchClient={searchClient}
            indexName={NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
            {...searchStateProps}
          >
            <Configure hitsPerPage={PER_PAGE} analytics={false} />
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col mt-16 grow min-w-[500px] max-w-[800px] w-screen">
                <div className="z-30 mt-10 mb-4 lg:my-6 text-kafeblack dark:text-kafewhite">
                  <ProposalStateTabs
                    attribute="state"
                    defaultRefinement={[
                      ProposalStateE.submitted,
                      ProposalStateE.writing,
                      ProposalStateE.readyToPublish,
                    ]}
                  />
                </div>
                <TutorialProposalHits />
                <Pagination />
              </div>
              <RightSidebar>
                <TutorialProposalHitFilter />
              </RightSidebar>
            </div>
          </InstantSearch>
        </div>
      </main>
    </div>
  );
};

export default Home;
