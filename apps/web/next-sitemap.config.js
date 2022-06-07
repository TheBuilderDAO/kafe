/** @type {import('next-sitemap').IConfig} */

const config = {
  siteUrl: 'https://dev.builderdao.io',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml', '/server-sitemap-index.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://dev.builderdao.io/learn/server-sitemap.xml', // <==== Add here
      'https://dev.builderdao.io/vote/server-sitemap.xml', // <==== Add here
    ],
  },
};

export default config;
