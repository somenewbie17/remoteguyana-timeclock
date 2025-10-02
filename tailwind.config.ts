import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--rg-primary)',
        bg: 'var(--rg-bg)',
        text: 'var(--rg-text)',
        surface: 'var(--rg-surface)'
      }
    }
  },
  plugins: []
} satisfies Config
