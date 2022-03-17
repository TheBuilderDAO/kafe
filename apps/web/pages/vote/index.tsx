import type { NextPage } from 'next';
import Head from 'next/head';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';
import TutorialProposalHit from '@app/components/Search/TutorialProposalHit';
import TutorialFilter from '@app/components/TutorialFilter';
import Pagination from '@app/components/Search/Pagination';
import Link from 'next/link';
import {
  ProposalStateE,
  useGetListOfProposals,
} from '@builderdao-sdk/dao-program';
import RightSidebar from '../../layouts/PublicLayout/RightSidebar';
import FundedTabs from '@app/components/Search/FundedTabs';
import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
} from '@app/constants';

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
        <title>Search Tutorial Proposals</title>
      </Head>

      <main>
        <InstantSearch
          searchClient={searchClient}
          indexName={NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
        >
          <Configure hitsPerPage={4} analytics={false} />
          <div className="flex justify-between items-start mt-8">
            <div className="flex flex-col grow">
              <div className="my-6">
                <FundedTabs
                  attribute="state"
                  defaultRefinement={[ProposalStateE.submitted]}
                />
              </div>
              <Hits hitComponent={TutorialProposalHit} />
              <Pagination />
            </div>
            <RightSidebar>
              <TutorialFilter />
            </RightSidebar>
          </div>
        </InstantSearch>
      </main>
    </div>
  );
};

export default Home;
