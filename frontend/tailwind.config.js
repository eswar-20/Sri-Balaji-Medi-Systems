/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'charcoal': '#1a1a1a',
        'matte-black': '#0d0d0d',
        'beige': '#f5f5dc',
        'ivory': '#fffff0',
        'muted-gold': '#d4af37',
        'dark-gray': '#2d2d2d',
        'medium-gray': '#4a4a4a',
        'light-gray': '#6b6b6b',
        'pale-beige': '#faf8f3',
        'warm-white': '#fefefe',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 25px rgba(0, 0, 0, 0.15)',
        'strong': '0 8px 35px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
