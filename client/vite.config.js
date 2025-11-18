import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This maps '@/' to the 'src' directory relative to the project root
      '@': path.resolve(__dirname, './src/'), 
    },
  },
})
