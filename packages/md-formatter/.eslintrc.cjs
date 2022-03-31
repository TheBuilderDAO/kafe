module.exports = {
  ...require('@builderdao/config/eslint-node'),
  parserOptions: {
    root: true,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}