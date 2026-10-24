/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a2240',
          950: '#071b34',
        },
        gold: {
          500: '#da8a24',
        }
      }
    },
  },
  plugins: [],
}
