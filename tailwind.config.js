/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'untitled-gray':{
          25: '#FCFCFD',
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#EAECF0',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1D2939',
          900: '#101828',
        },
      }
    },
    fontFamily:{
      sans: ['Montserrat', 'sans-serif'],
      heading: ['Rubik', 'sans-serif'],
      button: ['Rubik', 'sans-serif'],
      a: ['Rubik', 'sans-serif'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}