import { getServerSideSitemap, ISitemapField } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import algoliasearch from 'algoliasearch';
import {
  ALGOLIA_ADMIN_KEY,
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
} from '@app/constants';

const searchClient = algoliasearch(
  NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  ALGOLIA_ADMIN_KEY as string,
);

export const getServerSideProps: GetServerSideProps = async ctx => {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')

  const fields: ISitemapField[] = [
    {
      loc: 'https://dev.builderdao.io/learn', // Absolute url
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      // priority
    },
  ];

  const parseResult = hits => {
    hits.forEach(hit => {
      console.log(hit.state);
      fields.push({
        loc: `https://dev.builderdao.io/learn/${hit.slug}`,
        lastmod: new Date(hit.publishedAt).toISOString(),
        changefreq: 'weekly',
      });
    });
  };
  try {
    await searchClient.initIndex(NEXT_PUBLIC_ALGOLIA_INDEX_NAME).browseObjects({
      batch: parseResult,
      facetFilters: [['state:published']],
    });
    // const a = await searchClient.initIndex(NEXT_PUBLIC_ALGOLIA_INDEX_NAME).search("")
    // console.log(a)
  } catch (err) {
    console.log(err);
  }
  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
