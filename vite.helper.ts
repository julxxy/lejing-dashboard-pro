import { loadEnv } from 'vite'
import { base64Utils } from './src/common/base64Utils.ts'

/**
 * Vite config helper functions
 */

export const booleanUtils = {
  isTrue(value: unknown): boolean {
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase()
      return ['true', '1', 'on', 'yes'].includes(lowerValue)
    }
    return false
  }
}

/**
 * APIs 配置
 */
export const APIs = (mode: string) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDebugEnable = booleanUtils.isTrue(env.VITE_IS_DEBUG_ENABLE)

  const apiUrls = [{ key: 'apiUrl', url: env.VITE_API_URL }]
  let encodeByBase64 = false

  apiUrls.forEach(api => {
    if (base64Utils.isBase64(api.url)) {
      encodeByBase64 = true
      api.url = base64Utils.decodeBase64(api.url, 20)
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
