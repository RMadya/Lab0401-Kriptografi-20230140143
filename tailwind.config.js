/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/views/**/*.ejs', './public/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        ink: { 900: '#0f141c', 800: '#161d28', 700: '#212b3a' },
        paper: '#f5f6f8',
        fox: { 500: '#e2761b', 600: '#c9650f' },
      },
    },
  },
  plugins: [],
};
