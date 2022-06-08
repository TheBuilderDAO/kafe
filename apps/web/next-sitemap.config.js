/** @type {import('next-sitemap').IConfig} */

const config = {
  siteUrl: process.env.VERCEL_URL || 'https://dev.builderdao.io',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: [
    '/learn/server-sitemap.xml',
    '/vote/server-sitemap.xml',
    '/server-sitemap-index.xml',
  ], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://dev.builderdao.io/server-sitemap-index.xml',
      'https://dev.builderdao.io/learn/server-sitemap.xml', // <==== Add here
      'https://dev.builderdao.io/vote/server-sitemap.xml', // <==== Add here
    ],
  },
};

module.exports = config;
