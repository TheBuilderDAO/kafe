import type { NextPage } from 'next';
import Head from 'next/head';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, Configure } from 'react-instantsearch-dom';
import TutorialProposalHit from '@app/components/Search/TutorialProposalHit';
import TutorialFilter from '@app/components/TutorialFilter';
import Pagination from '@app/components/Search/Pagination';
import Link from 'next/link';
import { useGetListOfProposals } from '@builderdao-sdk/dao-program';
import RightSidebar from '../../layouts/PublicLayout/RightSidebar';
import InputCheckbox from '@app/components/FormElements/InputCheckbox';

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
          <div className="flex justify-between items-start">
            <div className="flex flex-col grow">
              <div className="my-6">
                <InputCheckbox
                  options={['current', 'funded']}
                  name="filter tutorials"
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
