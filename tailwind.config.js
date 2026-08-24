/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hemlock & Oak brand colors
        'ho-cream': '#f4f4f2',
        'ho-forest': '#293e1c',
        'ho-bronze': '#a47738',
        'ho-burgundy': '#711d2f',
        'ho-tan': '#d4c5a9',
        'ho-charcoal': '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
