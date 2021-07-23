module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Staatliches', 'cursive'],
        content: ['Montserrat', 'sans-serif'],
      },
      colors: {
        body: '#121212',
        card: '#181818',
        textPrimary: '#FFFFFF',
        textSec: '#B3B3B3',
      },
      fontSize: {
        xxs: '0.70rem',
      },
    },
  },
  variants: {},
};
