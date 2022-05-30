import {
  InstantSearch,
  Hits,
  Highlight,
  Configure,
  connectHighlight,
} from 'react-instantsearch-dom';

import Banner from '@app/components/Banner';

import Pagination from '@app/components/Search/Pagination';
import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
} from '@app/constants';
import { ProposalStateE } from '@builderdao/program-tutorial';
import algoliasearch from 'algoliasearch';
import useSearchState from 'hooks/useSearchState';
import Head from 'next/head';
import SearchBox from '@app/components/Search/SearchBox';
import Link from 'next/link';
import Tags from '@app/components/Tags/Tags';

const searchClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);

const PER_PAGE = 20;

export const SearchPage = () => {
  const searchStateProps = useSearchState();
  return (
    <>
      <Head>
        <title>Kafé by Builder DAO - Search Guides</title>
      </Head>
      <main className="mt-10">
        <Banner
          header="Learn from guides written by our community"
          description="If you like a guide, you can support the creators by tipping"
          link="https://builderdao.notion.site/Kaf-by-Builder-DAO-b46af3ff401448d789288f4b94814e19"
        />
        <div className="z-30 flex mb-20">
          <InstantSearch
            searchClient={searchClient}
            indexName={'tutorial_full_text'}
            // {...searchStateProps}
          >
            {/* <Configure
              hitsPerPage={PER_PAGE}
              analytics={false}
              filters="state:published"
            /> */}
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col mt-16 grow min-w-[500px] max-w-[800px]">
                <div className="lg:my-6 ">
                  <SearchBox />
                  <Hits hitComponent={Hit} />
                  {/* <GuideHits /> */}
                  <Pagination />
                </div>
              </div>
              {/* <RightSidebar>
                <GuideHitFilter />
              </RightSidebar> */}
            </div>
          </InstantSearch>
        </div>
      </main>
    </>
  );
};

const SearchHitComponent = ({ hit, highlight }) => {
  const excerpt = (content: string, limit: number = 200) => {
    if (content.length > limit) {
      return content.substring(0, 200) + '...';
    }
    return content;
  };
  const parsedHitContent = highlight({
    highlightProperty: '_highlightResult',
    attribute: 'content',
    hit,
  });

  const parsedHitSection = highlight({
    highlightProperty: '_highlightResult',
    attribute: 'section',
    hit,
  });
  return (
    <div className="flex flex-col  border-kafegold rounded mb-4 p-2 border-opacity-20 border-2">
      <div className="flex flex-row">
        <Link href={hit.permalink}>
          <h3 className="text-lg font-bold cursor-pointer">
            {parsedHitSection.map((part, index) =>
              part.isHighlighted ? (
                <mark key={index}>{part.value}</mark>
              ) : (
                <span key={index}>{part.value}</span>
              ),
            )}
          </h3>
        </Link>
      </div>
      <div>
        <p>
          {parsedHitContent.map((part, index) =>
            part.isHighlighted ? (
              <mark key={index}>{part.value}</mark>
            ) : (
              <span key={index}>{part.value}</span>
            ),
          )}
        </p>
      </div>
      <div>
        <Tags tags={hit.tags} />
      </div>
      <div>
        <p className="dark:text-kafewhite text-sm">From {hit.title}</p>
      </div>
    </div>
  );
};
const Hit = connectHighlight(SearchHitComponent);

export default SearchPage;
