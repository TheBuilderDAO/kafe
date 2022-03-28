const withTM = require('next-transpile-modules')([
  '@builderdao/ui',
  '@builderdao-sdk/dao-program',
  '@builderdao/md-utils',
]);

module.exports = withTM({
  reactStrictMode: true,
  domains: ['i.imgur.com'],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
});
