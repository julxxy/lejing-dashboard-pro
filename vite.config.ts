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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@types': path.resolve(__dirname, 'types')
      }
    },
    server: {
      open: false,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '/api')
        }
      }
    }
  }
})
