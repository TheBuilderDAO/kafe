const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './components/**/*.{jsx,tsx}',
    './pages/**/*.md',
    './pages/**/*.mdx',
    './theme.config.js',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.kafeblack,
        kafeblack: '#1E1C1E',
        kafewhite: '#EAE4D9',
        kafepurple: '#9462F7',
        kafegold: '#EFBB73',
        kafered: '#EB5F49',
        kafedarker: '#131213',
        kafelighter: '#FCFBF9',
        kafemellow: '#B2ADA4',
        kafedarkred: '#A24A5B',
        kafedarkpurple: '#B930B4',
        kafedarkgold: '#BA8D57',
      },
    },
  },
  plugins: [],
};
