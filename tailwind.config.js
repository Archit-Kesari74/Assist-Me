/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E5EFF',
          light: '#EAF2FF',
          dark: '#1547C9',
        },
        success: '#18864B',
        successLight: '#E6F4ED',
        error: '#C62828',
        errorLight: '#FCEAEA',
        bg: '#FAFBFD',
        ink: '#172033',
        muted: '#536078',
      },
      fontFamily: {
        sans: ['Nunito', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(23, 32, 51, 0.12)',
        ring: '0 0 0 8px rgba(30, 94, 255, 0.12)',
        mic: '0 16px 40px -12px rgba(30, 94, 255, 0.45)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.25)', opacity: '0' },
          '100%': { transform: 'scale(1.25)', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        soften: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 1.8s ease-out infinite',
        fadeUp: 'fadeUp 0.45s ease-out both',
        soften: 'soften 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};
