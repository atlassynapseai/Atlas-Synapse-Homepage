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
        'atlas-bg': '#0f172a',
        'atlas-surface': 'rgba(30, 41, 59, 0.6)',
        'atlas-blue': '#3b82f6',
        'atlas-cyan': '#06b6d4',
      },
      keyframes: {
        gradientShift: {
          '0%,100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-25px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        textReveal: {
          from: { 'clip-path': 'inset(0 100% 0 0)' },
          to: { 'clip-path': 'inset(0 0% 0 0)' },
        },
        borderGlow: {
          '0%,100%': { 'border-color': 'rgba(59,130,246,0.2)' },
          '50%': { 'border-color': 'rgba(59,130,246,0.8)' },
        },
        glowPulse: {
          '0%,100%': { 'box-shadow': '0 0 10px rgba(59,130,246,0.3)' },
          '50%': { 'box-shadow': '0 0 25px rgba(59,130,246,0.7), 0 0 60px rgba(59,130,246,0.3)' },
        },
      },
      animation: {
        'gradient-shift': 'gradientShift 15s ease infinite',
        'float': 'float 25s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.9s ease-out forwards',
        'text-reveal': 'textReveal 1.8s ease-out forwards',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
