import { InstantSearch, Hits, connectHighlight } from 'react-instantsearch-dom';

import Banner from '@app/components/Banner';

import Pagination from '@app/components/Search/Pagination';
import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
} from '@app/constants';
import algoliasearch from 'algoliasearch';
import useSearchState from 'hooks/useSearchState';
import Head from 'next/head';
import SearchBox from '@app/components/Search/SearchBox';
import CodeBlock from '@builderdao/ui/src/mdx/Code/CodeBlock';
import { HashtagIcon } from '@app/components/SVG/Hashtag';
import { DocumentIcon } from '@app/components/SVG/Document';
import { CodeIcon } from '@app/components/SVG/Code';
import { ListIcon } from '@app/components/SVG/List';
import { HitTreeIcon } from '@app/components/SVG/HitTree';

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

const HitIcon: React.FC<{
  type: 'lvl0' | 'lvl1' | 'lvl2' | 'lvl3' | 'code' | 'paragraph';
}> = ({ type }) => {
  switch (type) {
    case 'lvl1':
      return <DocumentIcon />;
    case 'code':
      return <CodeIcon />;
    case 'paragraph':
      return <ListIcon />;
    default:
      return (
        <div className="flex ">
          <HitTreeIcon />
          <HashtagIcon />
        </div>
      );
  }
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

  const findTheLinesHasHighlight = (content, matchedWords: string[]) => {
    const lines = [];
    content.split('\n').map((line, index) => {
      if (matchedWords.some(word => line.includes(word))) {
        lines.push(index + 1);
      }
    });
    return lines.length > 0 ? `{${lines.join(',')}}` : '';
  };
  const formatHighlight = (rawString: string) =>
    rawString.replace('ais-highlight-0000000000', 'em');
  return (
    <div className="flex flex-row  border-kafegold rounded mb-4 p-4 border-opacity-20 border-2 algolia-highlight">
      <div className="p-1 flex items-center justify-center min-w-[3rem]">
        <HitIcon type={hit.type as any} />
      </div>
      <div>
        <div className="flex row space-x-2 flex-wrap space-y-1 items-center justify-start">
          <span className="font-bold">
            <h1
              dangerouslySetInnerHTML={{
                __html: formatHighlight(hit._highlightResult.h1.value),
              }}
            />
          </span>
          {hit.h2 && (
            <span className="flex flex-row flex-nowrap space-x-2">
              <span>{'>'}</span>
              <h2
                dangerouslySetInnerHTML={{
                  __html: formatHighlight(hit._highlightResult.h2.value),
                }}
              />
            </span>
          )}
          {hit.h3 && (
            <span className="flex flex-row flex-nowrap space-x-2">
              <span>{'>'}</span>
              <h3
                dangerouslySetInnerHTML={{
                  __html: formatHighlight(hit._highlightResult.h3.value),
                }}
              />
            </span>
          )}
        </div>
        <div className="mt-4 ">
          {hit.type === 'code' && (
            <figure className="relative flex box-content">
              <CodeBlock
                codeString={hit.content}
                language={hit.lang}
                metastring={findTheLinesHasHighlight(
                  hit.content,
                  hit._highlightResult.content.matchedWords,
                )}
              ></CodeBlock>
            </figure>
          )}
          {hit.type === 'paragraph' && (
            <div className="flex flex-col text-kafemellow">
              <p
                dangerouslySetInnerHTML={{
                  __html: formatHighlight(hit._snippetResult.content.value),
                }}
              />
            </div>
          )}
        </div>
        <div>{/* <Tags tags={hit.tags} /> */}</div>
      </div>
    </div>
  );
};

const Hit = connectHighlight(SearchHitComponent);

export default SearchPage;
