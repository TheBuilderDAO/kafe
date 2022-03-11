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
        <div className="mb-5 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Have an idea for proposal?
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Submit your tutorial proposal and get paid</p>
                </div>
              </div>
              <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                <IsLoggedIn>
                  <Link href={routes.write.index} passHref>
                    <a className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                      Propose Tutorial
                    </a>
                  </Link>
                </IsLoggedIn>
              </div>
            </div>
          </div>
        </div>

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
