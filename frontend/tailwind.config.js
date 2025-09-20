/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#0f172a',
      },
    },
  },
  plugins: [],
};
