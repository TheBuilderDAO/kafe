module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        bazinga: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      colors: {
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
      fontFamily: {
        larken: ['Larken', 'sans-serif'],
        'larken-italic': ['Larken Italic', 'sans-serif'],
        'larken-extra-bold': ['Larken Extra Bold', 'sans-serif'],
        'larken-extra-bold-italic': ['Larken Extra Bold Italic', 'sans-serif'],
        space: ['Space Mono', 'monospace'],
        'space-italic': ['Space Mono Italic', 'monospace'],
        'space-bold': ['Space Mono Bold', 'monospace'],
        'space-bold-italic': ['Space Mono Bold Italic', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            'code::before': { content: '' },
            'code::after': { content: '' },
          },
        },
      },
      animation: {
        'slide-up': 'bazinga 0.5s ease forwards',
      },
      keyframes: {
        bazinga: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-70px)' },
        },
      },
      width: {
        menu: '320px',
      },
      screens: {
        phone: '300px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ],
};
