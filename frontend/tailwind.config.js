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
      },
      boxShadow: {
        'luxury': '0 4px 20px rgba(90, 42, 108, 0.15)',
        'gold': '0 4px 20px rgba(212, 175, 55, 0.3)',
        'card': '0 2px 16px rgba(0,0,0,0.08)',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
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
    },
  },
  plugins: [],
}
