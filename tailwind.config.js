/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#ff006e',
        secondary: '#4F10A8',
        info: '#1982C4',
        success: '#8AC926',
        link: '#4F10A8',
        warning: '#FF006E',
        white: '#FFFAEB',
        black: '#00173D',
        typography: {
          DEFAULT: '#00173D',
          light: '#FFEFC2',
          gray: '#CC9900',
        },
        background: {
          DEFAULT: '#FFFAEB',
          light: '#FFFAEB',
          dark: '#051824',
        },
      },
      fontFamily: {
        heading: ['Ubuntu_700Bold'],
        body: ['Ubuntu_400Regular'],
        mono: ['UbuntuMono_400Regular', 'sans-serif'],
        inter: ['Inter_900Black', 'sans-serif'],
        delaGothicOne: ['DelaGothicOne_400Regular'],
      },
      fontWeight: {
        extrablack: '950',
      },
      fontSize: {
        '2xs': '8px',
        xs: '10px',
        sm: '12px',
        md: '14px',
        lg: '16px',
        xl: '20px',
        '2xl': '22px',
      },
    },
  },
  plugins: [],
};
