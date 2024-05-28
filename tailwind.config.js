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
      gray: '#D4D4D4',
      red: '#8F211D',
      orange: '#F57805',
      orangeTinted: '#C7762A',
      blue: '#365787',
      lightblue: '#77BCED',
      lightblueBg: '#88C8EE',
      darkblue: '#272D4A',
      cyan: '#74C8F8',
      green: '#16EE1E',
      disabledGreen: '#549956',
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
        'land': 'url(./src/assets/images/LandingBg.png), linear-gradient(270deg, #74C8F8, #FFFFFF)',
      },
    },
  },
  plugins: [],
};
