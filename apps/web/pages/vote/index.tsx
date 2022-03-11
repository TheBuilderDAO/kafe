import type { NextPage } from 'next';
import Head from 'next/head';

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';
import TutorialProposalHit from '../../components/Search/TutorialProposalHit';
import Pagination from '../../components/Search/Pagination';
import MenuSelect from '../../components/Search/MenuSelect';
import ClearRefinements from '../../components/Search/ClearRefinements';
import RefinementList from '../../components/Search/RefinementList';
import routes from '../../routes';
import Link from 'next/link';
import SortBy from '@app/components/Search/SortBy';
import IsLoggedIn from '@app/components/IsLoggedIn/IsLoggedIn';
import { useGetListOfProposals } from '@builderdao-sdk/dao-program';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
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
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
        >
          <Configure
            filters="state:proposed"
            hitsPerPage={4}
            analytics={false}
          />
          <div className="flex flex-row gap-10">
            <div className="w-full">
              <Hits hitComponent={TutorialProposalHit} />
              <Pagination />
            </div>
          </div>
        </InstantSearch>
      </main>
    </div>
  );
};

export default Home;
