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
    fontSize
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