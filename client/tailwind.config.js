/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#edfffe',
          100: '#d0fffe',
          200: '#a0fffd',
          300: '#5ffcf9',
          400: '#17f0ee',
          500: '#00d4d4',
          600: '#00b3b3',
          700: '#008080',
          800: '#006666',
          900: '#004f4f',
        },
      },
      boxShadow: {
        'brand': '0 0 20px rgba(0, 212, 212, 0.15)',
      },
    },
  },
  plugins: [],
};