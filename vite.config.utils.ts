import { loadEnv } from 'vite'
import { base64Utils } from './src/common/base64Utils.ts'

/**
 * Vite config helper functions
 */

export function isTrue(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase()
    return ['true', '1', 'on', 'yes'].includes(lowerValue)
  }
  return false
}

export function isFalse(value: unknown) {
  return !isTrue(value)
}

export function optimizeChunks(id: string): string | undefined {
  // Split large libraries into separate chunks
  if (id && id.includes('node_modules')) {
    // Split large libraries into separate chunks
    if (id.includes('echarts')) return 'echarts'
    if (id.includes('antd')) return 'antd'
    if (id.includes('react')) return 'react'
    if (id.includes('axios')) return 'axios'
    // Default case: other node_modules chunks
    const packages = id.toString().split('node_modules/')[1]?.split('/')
    return packages && packages.length > 1 ? `${packages[0]}-${packages[1]}` : packages[0]
  }
}

/**
 * API 配置
 */
export const API = (mode: string) => {
  const env = loadEnv(mode, process.cwd(), '')

  const isDebugEnable = isTrue(env.VITE_IS_DEBUG_ENABLE)
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
    env,
    isDebugEnable,
    hosts: Object.fromEntries(apiUrls.map(api => [api.key, api.url])),
  }
}
