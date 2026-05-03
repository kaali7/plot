/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        primary: '#FF3366', // Vibrant Pink
        accent: '#8000FF',  // Deep Purple
        surface: 'rgba(255, 255, 255, 0.03)',
        'surface-light': 'rgba(255, 255, 255, 0.05)',
        'surface-dark': 'rgba(0, 0, 0, 0.2)',
        'editor-bg': '#0f0f15',
        'editor-card': 'rgba(255, 255, 255, 0.02)',
        'editor-border': 'rgba(255, 255, 255, 0.08)',
        'editor-text': '#f0f0f0',
        'editor-text-muted': 'rgba(255, 255, 255, 0.6)',
        'editor-magenta': '#FF3366',
      },
      fontFamily: {
        serif: ['Plus Jakarta Sans', 'sans-serif'], // Replacing serif with modern sans
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        sm: '8px',
        DEFAULT: '16px',
        card: '24px',
        pill: '999px',
      },
      boxShadow: {
        'magenta-glow': '0 8px 32px rgba(255, 51, 102, 0.15)',
        'magenta-glow-lg': '0 12px 48px rgba(255, 51, 102, 0.25)',
        'thin-border': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'magenta-border': '0 0 0 1px rgba(255, 51, 102, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'magenta-gradient': 'linear-gradient(135deg, #FF3366 0%, #a855f7 50%, #8000FF 100%)',
        'surface-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
      }
    },
  },
  plugins: [],
}