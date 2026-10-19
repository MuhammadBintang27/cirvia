/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'var(--font-emoji)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-emoji)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'monospace'],
      },
      boxShadow: {
        hard: '4px 4px 0 #1B1B2F',
        key: '0 5px 0 #1B1B2F',
        'key-sm': '0 3px 0 #1B1B2F',
      },
      colors: {
        // CIRVIA design tokens (neo-playful). primary/secondary below are legacy, used by unmigrated pages.
        cream: '#FFF6E5',
        paper: '#FFFFFF',
        ink: '#1B1B2F',
        muted: '#5B5B73',
        brand: { DEFAULT: '#2F5BFF', soft: '#DDE5FF' },
        lamp: { DEFAULT: '#FFC93C', soft: '#FFF0BF' },
        coral: { DEFAULT: '#FF6B5B', soft: '#FFE0DB' },
        mint: { DEFAULT: '#3DD6A0', soft: '#D5F7EA' },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
