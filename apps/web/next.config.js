const withTM = require('next-transpile-modules')([
  '@builderdao/ui',
  '@builderdao/dao-utils',
  '@builderdao-sdk/dao-program',
  '@builderdao/md-utils',
]);

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['i.imgur.com', 'github.com'],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
});
