import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'   // or vue, etc. – adjust to your framework

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})