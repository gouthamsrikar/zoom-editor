/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"PT Sans"', 'sans-serif'],
      metropolis: ['Metropolis', 'sans-serif'],
    },
    extend: {
      colors: {
        BG_GREY: '#676767',
        BG_BLACK: '#000000',
        BG_GROUP_BLACK: '#2c2c2c',
        BG_BORDER: '#424242',
        BG_TEXTFIELD: '#1F1F1F',
        BORDER: '#333333',
        BG_CANVAS: '#171717',
        ERROR_RED: '#eb1c23'
      },
    },
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
}

