/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/ui/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        chouhanrugs: {
          "primary": "#6c4624",
          "primary-content": "#ebebeb",
          "secondary": "#e5ccb5",
          "secondary-content": "#5d3c1e",
          "accent": "#6c4624",
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
