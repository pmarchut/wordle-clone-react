import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  server: {
    proxy: {
      '/functions/wordlist': {
        target: 'https://fly.wordfinderapi.com',
        changeOrigin: true,
        rewrite: () =>
          '/api/search?length=5&word_sorting=az&group_by_length=true&page_size=99999&dictionary=all_en',
      },
    },
  },
})
