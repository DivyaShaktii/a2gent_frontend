/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6a0dad', // Your main purple
          light: '#f3e5f5',
          hover: '#580b94',
        },
        bg: {
          app: '#f9f9fb',     // Light grey background
          panel: '#ffffff',
        },
        text: {
          primary: '#1c1c1e',
          secondary: '#8e8e93'
        }
      }
    },
  },
  plugins: [],
}