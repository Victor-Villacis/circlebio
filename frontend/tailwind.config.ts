import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        green: {
          100: '#E3F9E5',
          200: '#C1EAC5',
          300: '#A3D9A5',
          400: '#7BC47F',
          500: '#57AE5B',
          600: '#3F9142',
          700: '#2F8132',
          800: '#207227',
          900: '#0E5814',
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  darkMode: 'class',
};

export default config;
