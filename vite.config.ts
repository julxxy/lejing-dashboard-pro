import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { APIs } from './vite.helper.ts'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { hosts } = APIs(mode)
  const { apiUrl } = hosts
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      open: true,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
