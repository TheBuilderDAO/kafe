// theme.config.js
export default {
  projectLink: 'https://github.com/TheBuilderDAO/kafe', // GitHub link in the navbar
  docsRepositoryBase: 'https://github.com/TheBuilderDAO/kafe/blob/master', // base URL for the docs repository
  titleSuffix: ' – The Builder DAO',
  nextLinks: true,
  prevLinks: true,
  search: true,
  customSearch: null, // customizable, you can use algolia for example
  darkMode: true,
  footer: true,
  footerText: `${new Date().getFullYear()} © The Builder DAO.`,
  footerEditLink: `Edit this page on GitHub`,
  logo: (
    <>
      <svg>...</svg>
      <span>Next.js Static Site Generator</span>
    </>
  ),
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Nextra: the next docs builder" />
      <meta name="og:title" content="Nextra: the next docs builder" />
    </>
  ),
};
