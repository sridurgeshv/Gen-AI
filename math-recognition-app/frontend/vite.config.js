import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['5173-sridurgeshv-genai-jgk5mv1kll9.ws-us117.gitpod.io']
  }
})
