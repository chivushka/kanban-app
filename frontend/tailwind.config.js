/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        sakura: '#ffc1cc',
        l_sakura: '#ffdde2',
        graphite: '#1a1a1a',
        d_gray: '#2c2c2c',
        gray: '#515151',
        l_gray: '#838383',
        text: '#ffffff',
        error: '#ff5d7a',
      },
      borderRadius: {
        xl: '10px',
      },
      boxShadow: {
        custom: '0 1px 1px rgba(255, 255, 255, 0.06)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
    plugins: [require('tailwindcss'), require('autoprefixer')],
  },
};
