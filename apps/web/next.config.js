const { withSentryConfig } = require('@sentry/nextjs');
const withTM = require('next-transpile-modules')([
  '@builderdao/ui',
  '@builderdao-sdk/dao-program',
  '@builderdao/md-utils',
]);

const moduleExports = {
  reactStrictMode: true,
  images: {
    domains: ['i.imgur.com', 'github.com', 'raw.githubusercontent.com'],
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withTM(
  withSentryConfig(moduleExports, sentryWebpackPluginOptions),
);
