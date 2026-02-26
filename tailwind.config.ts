import fluid, { extract, screens, fontSize } from 'fluid-tailwind'
import type { Config } from 'tailwindcss'
const config: Config = {
  content: {
    files: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/ui/**/*.{js,ts,jsx,tsx}',
      './src/app/**/*.{js,ts,jsx,tsx}'
    ],
    extract
  },
  // Safelist classes that are dynamically generated or used by JS
  safelist: [
    'bg-red-500',
    'bg-yellow-500', 
    'bg-blue-500',
    'bg-green-500',
    'btn-disabled'
  ],
  theme: {
    screens,
    fontSize,
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(60px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.12)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '60%': { opacity: '1', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out both',
        'fade-in-up-delay-1': 'fade-in-up 0.8s ease-out 0.15s both',
        'fade-in-up-delay-2': 'fade-in-up 0.8s ease-out 0.3s both',
        'fade-in-up-delay-3': 'fade-in-up 0.8s ease-out 0.45s both',
        'fade-in-up-delay-4': 'fade-in-up 0.8s ease-out 0.6s both',
        'fade-in-down': 'fade-in-down 0.7s ease-out both',
        'fade-in': 'fade-in 1s ease-out both',
        'fade-in-slow': 'fade-in 1.5s ease-out both',
        'slide-in-left': 'slide-in-left 0.8s ease-out both',
        'slide-in-right': 'slide-in-right 0.8s ease-out both',
        'ken-burns': 'ken-burns 25s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'count-up': 'count-up 0.6s ease-out both',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [
    require('daisyui'),
    fluid
  ],
  daisyui: {
    themes: [
      {
        chouhanrugs: {
          "primary": "#6c4624",
          "primary-content": "#ebebeb",
          "secondary": "#e5ccb5",
          "secondary-content": "#5d3c1e",
          "accent": "#cc9a6c",
          "accent-content": "#ebebeb",
          "neutral": "#6c4624",
          "neutral-content": "#ebebeb",
          "base-100": "#ffffff",
          "base-200": "#f5ebe2",
          "base-300": "#e5ccb5",
          "base-content": "#000000",
          "info": "#0ea5e9",
          "info-content": "#000a13",
          "success": "#84cc16",
          "success-content": "#060f00",
          "warning": "#facc15",
          "warning-content": "#150f00",
          "error": "#e11d48",
          "error-content": "#ffd8d9",
        },
      }
    ]
  }
}

export default config