import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDebugEnable = isTrue(env.VITE_IS_DEBUG_ENABLE)
  if (isDebugEnable) {
    console.log()
  }
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})

// Helper functions
//
// function isBase64(str) {
//     const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
//     if (!base64Regex.test(str)) {
//         return false
//     }
//     try {
//         atob(str)
//         return true
//     } catch (e) {
//         return false
//     }
// }
//
// function encodeBase64(str, recursiveCount = 1, currentCount = 0) {
//     if (currentCount >= recursiveCount) {
//         return str
//     }
//     const utf8Bytes = new TextEncoder().encode(str)
//     const base64String = btoa(String.fromCharCode(...utf8Bytes))
//     return encodeBase64(base64String, recursiveCount, currentCount + 1)
// }
//
// function decodeBase64(encodedStr) {
//     let decode = encodedStr
//     if (isBase64(decode)) {
//         decode = utf8Decode(decode)
//         decode = atob(decode)
//         return decodeBase64(decode)
//     } else {
//         return decode
//     }
// }
//
// function utf8Decode(utf8String) {
//     const bytes = new Uint8Array(utf8String.split('').map((char) => char.charCodeAt(0)))
//     return new TextDecoder().decode(bytes)
// }
//
/**
 * This function is used to convert a string or boolean value to boolean.
 */
function isTrue(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value.toLowerCase() === '1'
  }
  return Boolean(value).valueOf()
}
