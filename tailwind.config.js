/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        playStationBlue: '#003791',
        softWhite: '#f8f9fa',
      },
    },
  },
  plugins: [],
}
