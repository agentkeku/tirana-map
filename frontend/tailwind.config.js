/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: '#C8583A',
        'terracotta-light': '#E8987E',
        'terracotta-pale': '#F7EDE8',
        ink: '#1A1410',
        'ink-mid': '#4A3F38',
        'ink-soft': '#8A7E78',
        cream: '#FAF7F2',
        'cream-dark': '#F0EBE2',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
