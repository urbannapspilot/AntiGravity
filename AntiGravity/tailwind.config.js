/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 2px 8px -2px rgba(15, 23, 42, 0.05)',
        'md': '0 8px 24px -4px rgba(15, 23, 42, 0.06), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        'lg': '0 20px 40px -8px rgba(15, 23, 42, 0.08), 0 8px 16px -4px rgba(15, 23, 42, 0.04)',
        'card': '0 2px 12px rgba(15, 23, 42, 0.04), 0 0 1px rgba(15, 23, 42, 0.1)',
        'float': '0 24px 48px -12px rgba(15, 23, 42, 0.15)',
      }
    },
  },
  plugins: [],
}
