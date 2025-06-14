import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.DEPLOY_TARGET === 'gh-pages' ? '/forela/' : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
