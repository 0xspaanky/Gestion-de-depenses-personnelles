import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the Personal Expense Manager frontend
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5284,
  },
  preview: {
    host: true,
    port: 5284,
  },
})
