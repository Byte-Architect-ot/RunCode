/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e6ff',
          300: '#66daff',
          400: '#33cdff',
          500: '#00c1ff',
          600: '#009acc',
          700: '#007499',
          800: '#004d66',
          900: '#002733',
        },
        dark: {
          50: '#e6e6e8',
          100: '#cdced1',
          200: '#9b9ca3',
          300: '#696b75',
          400: '#373947',
          500: '#1a1a2e',
          600: '#151525',
          700: '#10101c',
          800: '#0b0b13',
          900: '#050509',
        },
        surface: {
          100: '#1e1e32',
          200: '#16213e',
          300: '#0f3460',
          400: '#0a2540',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}