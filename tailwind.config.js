/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8f0',
          100: '#ffecd5',
          500: '#f97316',
          600: '#ea6c0a',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
        },
        maroon: {
          700: '#7b1e1e',
          800: '#5c1a1a',
        },
      },
      fontFamily: {
        display: ['Cinzel Decorative', 'serif'],
        heading: ['Cinzel', 'serif'],
        devanagari: ['Noto Serif Devanagari', 'serif'],
        body: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
