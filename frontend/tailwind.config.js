/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#FFFFFF', // Dominant text/highlights
          pink: '#F59CA9', // Accent 1
          salmon: '#F6828C', // Accent 2
          orchid: '#DF57BC', // Accent 3
          purple: '#A03E99', // Accent 4
          dark: '#1e293b', // Deep charcoal/slate
          darker: '#0f172a', // Very dark slate (Background)
          card: '#1e293b', // Slightly lighter than bg
          border: '#334155', // Subtle border
        }
      }
    },
  },
  plugins: [],
}

