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
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
        ],
        display: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'hero': 'clamp(3rem, 8vw + 2rem, 6rem)',
        'display': 'clamp(2rem, 4vw + 1rem, 3.25rem)',
        'h2': 'clamp(1.75rem, 2.5vw + 0.75rem, 2.5rem)',
        'body': 'clamp(1rem, 0.5vw + 0.9rem, 1.125rem)',
        'small': 'clamp(0.875rem, 0.25vw + 0.8rem, 0.9375rem)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'atlas-sm': '0.5rem',
        'atlas-md': '0.75rem',
        'atlas-lg': '1rem',
        'atlas-xl': '1.25rem',
        'atlas-2xl': '1.5rem',
      },
      colors: {
        'atlas-bg': '#050816',
        'atlas-surface': '#050b18',
        'atlas-elevated': '#0b1020',
        'atlas-border': 'rgba(148, 163, 184, 0.35)',
        'atlas-soft': 'rgba(15,23,42,0.8)',
        'atlas-primary': '#a855f7',
        'atlas-primary-soft': 'rgba(168, 85, 247, 0.35)',
        'atlas-secondary': '#38bdf8',
        'atlas-accent': '#e5e7eb',
        'atlas-danger': '#f97373',
        'atlas-success': '#34d399',
      },
      boxShadow: {
        'atlas-soft': '0 18px 45px rgba(15,23,42,0.85)',
        'atlas-glow': '0 0 40px rgba(168,85,247,0.4)',
        'atlas-glow-sm': '0 0 20px rgba(168,85,247,0.3)',
        'atlas-border-glow': '0 0 0 1px rgba(148,163,184,0.4)',
      },
      backgroundImage: {
        'atlas-radial': 'radial-gradient(circle at top, rgba(168,85,247,0.22), transparent 60%), radial-gradient(circle at bottom, rgba(56,189,248,0.18), transparent 65%)',
      },
      keyframes: {
        'web-pulse': {
          '0%, 100%': { opacity: '0.75' },
          '50%': { opacity: '1' },
        },
        'streak': {
          '0%': { transform: 'translateX(-100%) rotate(var(--streak-rotate, -15deg))' },
          '100%': { transform: 'translateX(100vw) rotate(var(--streak-rotate, -15deg))' },
        },
        'atlas-shine': {
          'to': { 'background-position': '200% center' },
        },
        'gradientShift': {
          '0%,100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'float': {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-25px)' },
        },
        'fadeInUp': {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'textReveal': {
          'from': { 'clip-path': 'inset(0 100% 0 0)' },
          'to': { 'clip-path': 'inset(0 0% 0 0)' },
        },
        'borderGlow': {
          '0%,100%': { 'border-color': 'rgba(59,130,246,0.2)' },
          '50%': { 'border-color': 'rgba(59,130,246,0.8)' },
        },
        'glowPulse': {
          '0%,100%': { 'box-shadow': '0 0 10px rgba(59,130,246,0.3)' },
          '50%': { 'box-shadow': '0 0 25px rgba(59,130,246,0.7), 0 0 60px rgba(59,130,246,0.3)' },
        },
      },
      animation: {
        'web-pulse': 'web-pulse 4s ease-in-out infinite',
        'streak': 'streak 18s linear infinite',
        'atlas-shine': 'atlas-shine 3s ease-in-out infinite',
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
