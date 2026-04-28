/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        primary: '#5a007a',
        accent: '#8a00c2',
        surface: '#1a001f',
        danger: '#dc2626',
        calm: '#6b46c1',
        highlight: '#a855f7',
        info: '#4f46e5',
      },
      borderRadius: {
        DEFAULT: '16px',
        card: '20px',
        pill: '999px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(138, 0, 194, 0.2)',
      },
    },
  },
  plugins: [],
}