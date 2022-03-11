module.exports = {
    ...require('@builderdao/config/eslint-next'),
    parserOptions: {
      root: true,
      tsconfigRootDir: __dirname,
      project: ['./tsconfig.lint.json'],
    },
  }