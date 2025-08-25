/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Culori brand
        primary: {
          DEFAULT: '#38bdf8',
          dark: '#0ea5e9',
          light: '#7dd3fc',
        },
        secondary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          light: '#a5b4fc',
        },
        accent: {
          DEFAULT: '#f97316',
          dark: '#ea580c',
          light: '#fdba74',
        },
        neutral: {
          DEFAULT: '#64748b',
          dark: '#475569',
          light: '#cbd5e1',
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#0f172a',
        },
        surface: {
          DEFAULT: '#f8fafc',
          dark: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}
