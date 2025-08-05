/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightBg: "#E2E8F0",
        lightBgPrimary: "#F8FAFC",
        lightBgSecondary: "#0F172A",
      },
      screens: {
        'sm': '576px',
        'md': '960px',
        'lg': '1440px',
      },
    },
  },
  plugins: [],
}