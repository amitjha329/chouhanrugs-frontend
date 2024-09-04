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
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      {
        chouhanrugs: {
          "primary": "#954a2b",
          "secondary": "#e7cbb9",
          "accent": "#7c2d12",
          "neutral": "#7f1d1d",
          "base-100": "#ffffff",
          "info": "#597BD9",
          "success": "#1C9C5E",
          "warning": "#EC9232",
          "error": "#F31B34",
        },
        caredone: {
          "primary": "#38BDF8",
          "secondary": "#84CC16",
          "accent": "#38B",
          "neutral": "#38BDF8",
          "base-100": "#ffffff",
          "info": "#38BDF8",
          "success": "#84CC16",
          "warning": "#fcd34d",
          "error": "#ef4444",
        }
      }
    ]
  }
}
