/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#FFFFFF',
          secondary: '#F8F9FA',
          tertiary: '#F0F4FF',
          'accent-light': '#EEF2FF',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          white: '#FFFFFF',
        },
        accent: {
          primary: '#4F46E5',
          'primary-hover': '#4338CA',
          'primary-light': '#818CF8',
          secondary: '#06B6D4',
          'secondary-hover': '#0891B2',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        ui: {
          border: '#E5E7EB',
          'border-light': '#F3F4F6',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      fontSize: {
        'hero-desktop': '64px',
        'hero-tablet': '48px',
        'hero-mobile': '36px',
        'h1-desktop': '48px',
        'h1-tablet': '40px',
        'h1-mobile': '32px',
        'h2-desktop': '36px',
        'h2-tablet': '32px',
        'h2-mobile': '28px',
        'h3-desktop': '28px',
        'h3-tablet': '24px',
        'h3-mobile': '22px',
        'h4-desktop': '24px',
        'h4-tablet': '20px',
        'h4-mobile': '18px',
        'body-xl': '20px',
        'body-large': '18px',
        'body': '16px',
        'body-small': '14px',
        'caption': '12px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'light': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 20px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 40px -4px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
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
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
