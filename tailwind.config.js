/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens from the ROOT CO. PRD
        sidebar: '#181818',
        'sidebar-deep': '#0F0F0E',
        'page-bg': '#F3F5ED',
        card: '#FFFFFF',
        line: '#DEE0D9',
        text: '#181818',
        muted: '#4D4E4A',
        olive: '#8C8D40',
        'olive-light': '#EDEED9',
        soft: '#F9F9F2',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16,16,12,0.04), 0 2px 6px 0 rgba(16,16,12,0.05)',
        pop: '0 8px 24px 0 rgba(16,16,12,0.10)',
      },
    },
  },
  plugins: [],
}