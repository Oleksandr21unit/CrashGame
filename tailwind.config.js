/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}',
  ],
  important: false,
  theme: {
    screens: {
      'sm': '391px',
    },
    colors: {
      black: '#000',
      white: '#FFF',
      red: '#8F211D',
      orange: '#F57805',
      blue: '#365787',
      lightblue: '#77BCED',
      lightblueBg: '#88C8EE',
      darkblue: '#272D4A',
      green: '#16EE1E',
      yellow: '#FEC700',

      backdropColor: 'rgba(0,0,0, 0.4)',
      whiteOpaque: 'rgba(255,255,255,0.6)'
    },
    fontFamily: {
      montserrat: ['Montserrat', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        'win': 'url(./src/assets/images/WinBg.svg)',
      },
    },
  },
  plugins: [],
};
