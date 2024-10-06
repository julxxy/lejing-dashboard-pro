import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { API, isFalse, isTrue, optimizeChunks } from './vite.config.utils.ts'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { env, hosts } = API(mode)
  const { apiUrl } = hosts
  return {
    plugins: [
      react(),
      visualizer({
        open: isFalse(env.VITE_IS_PROD),
        filename: 'index-bundle-analysis.html',
        template: 'sunburst'
      })
    ],
    build: {
      rollupOptions: {
        treeshake: true,
        output: {
          manualChunks(id) {
            return optimizeChunks(id)
          }
        }
      },
      chunkSizeWarningLimit: 1500
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@types': path.resolve(__dirname, 'types')
      }
    },
    server: {
      open: isTrue(env.VITE_OPEN_BROWSER),
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
