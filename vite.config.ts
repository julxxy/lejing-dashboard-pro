import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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

// Helper functions
function isBase64(str: string) {
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
  if (!base64Regex.test(str)) {
    return false
  }
  try {
    atob(str)
    return true
  } catch {
    return false
  }
}

function encodeBase64(str: string, recursiveCount = 1, currentCount = 0) {
  if (currentCount >= recursiveCount) {
    return str
  }
  const utf8Bytes = new TextEncoder().encode(str)
  const base64String = btoa(String.fromCharCode(...utf8Bytes))
  return encodeBase64(base64String, recursiveCount, currentCount + 1)
}

function decodeBase64(encodedStr: string) {
  let decode = encodedStr
  if (isBase64(decode)) {
    decode = utf8Decode(decode)
    decode = atob(decode)
    return decodeBase64(decode)
  } else {
    return decode
  }
}

function utf8Decode(utf8String: string) {
  const bytes = new Uint8Array(utf8String.split('').map(char => char.charCodeAt(0)))
  return new TextDecoder().decode(bytes)
}

/**
 * This function is used to convert a string or boolean value to boolean.
 */
function isTrue(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value.toLowerCase() === '1' || value.toLowerCase() === 'on'
  }
  return Boolean(value).valueOf()
}

/**
 * APIs
 */
const APIs = (mode: string) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDebugEnable = isTrue(env.VITE_IS_DEBUG_ENABLE)
  const apiUrls = [{ key: 'apiUrl', url: env.VITE_API_URL }]

  encodeBase64('hello world') // test encodeBase64 function

  let encodeByBase64 = false
  apiUrls.forEach(api => {
    if (isBase64(api.url)) {
      encodeByBase64 = true
      api.url = decodeBase64(api.url)
    }
  })

  if (isDebugEnable && encodeByBase64) {
    // eslint-disable-next-line no-console
    console.log(`Parsed APIs: ${apiUrls.map(api => api.url).join(', ')}\n`)
  }

  return {
    isDebugEnable,
    hosts: Object.fromEntries(apiUrls.map(api => [api.key, api.url]))
  }
}
