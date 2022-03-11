import React from 'react';
import SortBy from '@app/components/Search/SortBy';
import MenuSelect from '../../components/Search/MenuSelect';
import ClearRefinements from '../../components/Search/ClearRefinements';
import RefinementList from '../../components/Search/RefinementList';
import algoliasearch from 'algoliasearch/lite';
import { useRouter } from 'next/router';
import { InstantSearch } from 'react-instantsearch-dom';

const RightSidebar = () => {
  const router = useRouter();

  if (router.pathname === '/vote') {
    const searchClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
    );

    return (
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
      >
        <div className="mb-5 w-60">
          <div className="p-5 text-gray-500 shadow sm:rounded-lg">
            <div className="mb-6">
              <h2 className="font-bold">Sort by</h2>
              <SortBy
                defaultRefinement={'number_of_votes_desc'}
                items={[
                  { value: 'number_of_votes_desc', label: 'Most votes' },
                  { value: 'number_of_votes_asc', label: 'Least votes' },
                ]}
              />
            </div>
            <div className="mb-6">
              <h2 className="font-bold">Tags</h2>
              <RefinementList attribute="tags" />
            </div>
            <div className="mb-6">
              <h2 className="font-bold">Difficulty</h2>
              <MenuSelect attribute="difficulty" />
            </div>
            <ClearRefinements />
          </div>
        </div>
      </InstantSearch>
    );
  } else if (router.pathname === '/vote/[slug]') {
  }

  return null;
};

export default RightSidebar;
