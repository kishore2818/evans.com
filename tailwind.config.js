/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#f5f0f9',
          100: '#ede0f5',
          200: '#d9bfeb',
          300: '#bf93db',
          400: '#a062c7',
          500: '#8540b0',
          600: '#6e2f95',
          700: '#5A2A6C',
          800: '#4a2258',
          900: '#3e1d4a',
          950: '#1a0a22',
        },
        gold: {
          50: '#fdf9ec',
          100: '#faf0cc',
          200: '#f4df95',
          300: '#edc757',
          400: '#D4AF37',
          500: '#c49b1a',
          600: '#a97f12',
          700: '#886212',
          800: '#714f15',
          900: '#604217',
        },
        beige: {
          50: '#fdfcfb',
          100: '#F5F1EA',
          200: '#ede5d6',
          300: '#e0d4bc',
          400: '#cfbd9d',
          500: '#bea37e',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        'luxury': '0 4px 24px rgba(90, 42, 108, 0.18), 0 1px 4px rgba(90, 42, 108, 0.08)',
        'luxury-lg': '0 12px 48px rgba(90, 42, 108, 0.24), 0 4px 12px rgba(90, 42, 108, 0.12)',
        'gold': '0 4px 20px rgba(212, 175, 55, 0.35)',
        'gold-lg': '0 8px 32px rgba(212, 175, 55, 0.5)',
        'card': '0 2px 16px rgba(0,0,0,0.08)',
        'float': '0 20px 60px rgba(62, 29, 74, 0.20), 0 4px 16px rgba(62, 29, 74, 0.10)',
        'glass': '0 8px 32px rgba(62, 29, 74, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
        'nav': '0 2px 20px rgba(62, 29, 74, 0.08), 0 0 0 1px rgba(255,255,255,0.6)',
        'inner-glow': 'inset 0 0 20px rgba(212, 175, 55, 0.15)',
      },
      animation: {
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'float': 'float 3.5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        'fade-slide-up': 'fade-slide-up 0.6s ease-out forwards',
        'spin-slow': 'spin-slow 12s linear infinite',
        'orb-drift': 'orb-drift 8s ease-in-out infinite alternate',
        'hero-text': 'hero-text 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'badge-pop': 'badge-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-14px) rotate(3deg)' },
          '66%': { transform: 'translateY(-7px) rotate(-2deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.0)' },
          '50%': { boxShadow: '0 0 24px 6px rgba(212, 175, 55, 0.35)' },
        },
        'fade-slide-up': {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'orb-drift': {
          '0%': { transform: 'translate(0%, 0%) scale(1)' },
          '100%': { transform: 'translate(8%, 12%) scale(1.15)' },
        },
        'hero-text': {
          from: { opacity: '0', transform: 'translateY(40px) skewY(3deg)' },
          to: { opacity: '1', transform: 'translateY(0) skewY(0)' },
        },
        'badge-pop': {
          '0%': { transform: 'scale(0) rotate(-15deg)', opacity: '0' },
          '70%': { transform: 'scale(1.15) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-royal': 'linear-gradient(135deg, #3e1d4a 0%, #5A2A6C 50%, #8540b0 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #edc757 50%, #D4AF37 100%)',
        'gradient-hero': 'linear-gradient(160deg, #1a0a22 0%, #3e1d4a 40%, #6e2f95 100%)',
      },
    },
  },
  plugins: [],
}

