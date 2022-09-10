/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "loading": "rgba(255,255,255,0.6)",
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
