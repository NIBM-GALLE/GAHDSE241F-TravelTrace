/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B4EFF',
        'primary-dark': '#5B3FEF',
      },
    },
  },
  plugins: [],
};