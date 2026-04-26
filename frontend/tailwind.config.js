/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0600',
        card: '#110a02',
        border: 'rgba(251, 191, 36, 0.1)',
        'border-bright': 'rgba(251, 191, 36, 0.3)',
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          hot: '#ff6b1a',
        },
        navy: {
          800: '#0f172a',
          900: '#020617',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        amber: '0 4px 15px rgba(251, 191, 36, 0.15)',
        'amber-lg': '0 8px 25px rgba(251, 191, 36, 0.25)',
      }
    },
  },
  plugins: [],
}
