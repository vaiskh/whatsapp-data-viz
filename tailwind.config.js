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
        dark: '#212121',
        primary: '#BBFDCE',
        primaryDark: '#65ff91',
        accent: '#2B44FF33',
        accentDark: '#2f47fc',
      },
      fontSize: {
        xxs: '0.70rem',
        title: '64px',
        heading: '24px',
        content: '18px',
      },
    },
  },
  variants: {},
};
