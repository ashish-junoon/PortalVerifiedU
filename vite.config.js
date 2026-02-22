import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: 'rgb(0, 0, 255)', // Example of replacing 'oklch' with 'rgb'
        secondary: '#ff6347', // Example using hex color instead
      },
    },
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    historyApiFallback: true,
  },
})



