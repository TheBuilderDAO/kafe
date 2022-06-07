// pages/server-sitemap-index.xml/index.tsx
import { getServerSideSitemapIndex } from 'next-sitemap';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ctx => {
  const siteUrl = process.env.VERCEL_URL || 'localhost:3000';
  return getServerSideSitemapIndex(ctx, [
    `https://${siteUrl}/learn/server-sitemap.xml`,
    `https://${siteUrl}/vote/server-sitemap.xml`,
  ]);
};

// Default export to prevent next.js errors
export default function SitemapIndex() {}
