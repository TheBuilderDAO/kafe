module.exports = {
  ...require('@builderdao/config/eslint-next'),
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
};
