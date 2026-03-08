/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'atlas-primary': '#a855f7',
        'atlas-secondary': '#ec4899',
        'atlas-soft': 'rgba(168, 85, 247, 0.1)',
        'atlas-bg': '#050816',
      },
    },
  },
  plugins: [],
}
