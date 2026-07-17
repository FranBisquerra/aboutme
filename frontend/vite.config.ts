import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [vue(), ui({
    ui: {
      colors: {
        primary: 'indigo',
        neutral: 'gray',
      },
    },
  })],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
