/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
     extend: {
       colors: {
         background: '#282c34',
         primary: '#61afef',
         secondary: '#e5c07b',
         text: '#abb2bf',
         muted: '#5c6370',
         accent: '#e5c07b', // Mapping accent to secondary for compatibility
         surface: 'rgba(255, 255, 255, 0.04)',
         'surface-light': 'rgba(255, 255, 255, 0.08)',
         'surface-dark': 'rgba(0, 0, 0, 0.25)',
         'editor-bg': '#282c34',
         'editor-card': 'rgba(255, 255, 255, 0.03)',
         'editor-border': 'rgba(255, 255, 255, 0.1)',
         'editor-text': '#abb2bf',
         'editor-text-muted': '#5c6370',
         plotBlack: '#262A30',
       },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '8px',
        DEFAULT: '16px',
        card: '24px',
        pill: '999px',
      },
      boxShadow: {
        'primary-glow': '0 8px 32px rgba(97, 175, 239, 0.15)',
        'primary-glow-lg': '0 12px 48px rgba(97, 175, 239, 0.25)',
        'thin-border': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'primary-border': '0 0 0 1px rgba(97, 175, 239, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #61afef 0%, #e5c07b 100%)',
        'surface-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
      }
    },
  },
  plugins: [],
}