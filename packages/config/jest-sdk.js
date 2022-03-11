module.exports = {
  ...require('./jest-common'),
  testenvironment: 'jsdom',
  setupfilesafterenv: ['@testing-library/jest-dom'],
  collectcoveragefrom: ['**/ts-sdk/**/*.{js,ts,jsx,tsx}'],
  modulefileextensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
    '^.+\\.jsx?$': 'esbuild-jest',
  },
  coveragepathignorepatterns: [],
  coveragethreshold: null,
}
