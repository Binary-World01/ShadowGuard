/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0a0c',
          card: '#121216',
          primary: '#3b82f6',
          danger: '#ef4444',
          accent: '#10b981'
        }
      }
    },
  },
  plugins: [],
}
