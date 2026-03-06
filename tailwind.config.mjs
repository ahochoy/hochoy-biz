/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bauhaus-red':    '#be1e2d',
        'bauhaus-yellow': '#ffde17',
        'bauhaus-blue':   '#21409a',
      },
      fontFamily: {
        heading: ['Newsreader', 'Georgia', 'serif'],
        body:    ['Instrument Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
