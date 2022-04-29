// next.config.js
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  // optional: add `unstable_staticImage: true` to enable Nextra's auto image import
});
module.exports = withNextra({
  images: {
    domains: [
      'i.imgur.com',
      'github.com',
      'raw.githubusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
});
