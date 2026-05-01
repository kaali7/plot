/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        primary: '#ff00ff', // Magenta accent
        accent: '#ff00ff',
        surface: '#0a0a0a',
        'editor-bg': '#050505',
        'editor-card': '#0a0a0a',
        'editor-border': '#1a1a1a',
        'editor-text': '#e0e0e0',
        'editor-text-muted': '#666666',
        'editor-magenta': '#ff00ff',
      },
      fontFamily: {
        serif: ['EB Garamond', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px', // Sharper edges for tactile feel
        card: '4px',
        pill: '999px',
      },
      boxShadow: {
        'magenta-glow': '0 0 20px rgba(255, 0, 255, 0.15)',
        'thin-border': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'magenta-gradient': 'linear-gradient(135deg, #ff00ff 0%, #800080 100%)',
      }
    },
  },
  plugins: [],
}