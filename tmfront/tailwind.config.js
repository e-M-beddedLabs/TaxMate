/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#060606',
        // Primary - Vibrant Red/Orange #C72403
        primary: {
          50: '#fef3f2',
          100: '#fee4e1',
          200: '#ffcdc7',
          300: '#fda99f',
          400: '#f97668',
          500: '#f04a38',
          600: '#C72403',
          700: '#a61f03',
          800: '#8a1d06',
          900: '#721e0c',
          950: '#3e0b02',
        },
        // Secondary - Teal/Blue #277395
        secondary: {
          50: '#f0f9fb',
          100: '#d9f0f5',
          200: '#b8e1ec',
          300: '#87cbdd',
          400: '#4facc6',
          500: '#338fac',
          600: '#277395',
          700: '#265e79',
          800: '#264f64',
          900: '#244355',
          950: '#132b39',
        },
        // Accent - Dark Burgundy #320d1F
        accent: {
          50: '#fdf2f7',
          100: '#fce7f1',
          200: '#fbd0e4',
          300: '#f8a9cd',
          400: '#f172a9',
          500: '#e74a87',
          600: '#d42a64',
          700: '#b71d4b',
          800: '#971b3f',
          900: '#7e1b38',
          950: '#320d1F',
        },
        // Text colors
        text: {
          primary: '#f5f0f2',
          secondary: '#9a8f94',
          muted: '#6b5f64',
        },
        // Dark mode colors based on burgundy
        dark: {
          bg: '#0d0a0c',
          card: '#1a1318',
          border: '#2d2028',
          hover: '#3d2d35',
          text: '#f5f0f2',
          muted: '#9a8f94',
        },
        // Light mode colors
        light: {
          bg: '#fafafa',
          card: '#ffffff',
          border: '#e8e4e6',
          hover: '#f5f0f2',
          text: '#1a1318',
          muted: '#6b5f64',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(199, 36, 3, 0.3)',
        'glow-secondary': '0 0 20px rgba(39, 115, 149, 0.3)',
      },
    },
  },
  plugins: [],
}
