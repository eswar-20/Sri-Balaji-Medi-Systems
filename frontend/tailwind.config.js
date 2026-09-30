/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medical-primary': '#0284C7',
        'medical-dark': '#0369A1',
        'medical-navy': '#0C4A6E',
        'medical-teal': '#0D9488',
        'medical-accent': '#0284C7',
        // Compatibility & neutral tokens for clean light medical design
        'matte-black': '#F8FAFC',
        'charcoal': '#0F172A',
        'beige': '#0F172A',
        'ivory': '#FFFFFF',
        'muted-gold': '#0284C7',
        'dark-gray': '#334155',
        'medium-gray': '#64748B',
        'light-gray': '#94A3B8',
        'pale-beige': '#F1F5F9',
        'warm-white': '#FFFFFF',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'strong': '0 10px 30px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}

