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
import TutorialProposalFilter from '@app/components/Search/TutorialProposalFilter';

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
    return <div>Loading</div>;
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
  return (
    <div>
      <Head>
        <title>Search Proposals</title>
      </Head>

      <main className="w-full">
        <Banner
          header="Upvote proposals you want to see get written."
          description="Once a proposal gets 100 votes it will be funded by the community."
          link="https://figment.io"
        />
        <div className="z-30 flex mb-20">
          <InstantSearch
            searchClient={searchClient}
            indexName={NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
          >
            <Configure hitsPerPage={4} analytics={false} />
            <div className="flex items-start justify-between">
              <div className="flex flex-col grow">
                <div className="my-6">
                  <ProposalStateTabs
                    attribute="state"
                    defaultRefinement={[ProposalStateE.submitted]}
                  />
                </div>
                <Hits hitComponent={TutorialProposalHit} />
                <Pagination />
              </div>
              <RightSidebar>
                <TutorialProposalFilter />
              </RightSidebar>
            </div>
          </InstantSearch>
        </div>
      </main>
    </div>
  );
};

export default Home;
