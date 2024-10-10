import axios, { AxiosError, AxiosInstance } from 'axios'
import { hideLoading, showLoading } from '@/views/loading'
import storageUtils from '@/utils/storageUtils.ts'
import { Result } from '@/types/apiTypes.ts'
import { debugEnable, log } from '@/common/loggerProvider.ts'

import { IRequestConfig } from '@/axios-conf'
import { base64Utils } from '@/common/base64Utils.ts'
import { message } from '@/context/AntdGlobalProvider.ts'
import { isFalse } from '@/common/booleanUtils.ts'
import { URIs } from '@/router'

/**
 * API Token
 */
let apiToken = import.meta.env.VITE_API_TOKEN as string
const tokenIsBase64 = base64Utils.isBase64(apiToken)
if (debugEnable) log.debug(`API token is base64: ${tokenIsBase64}, apiToken: ${apiToken}`)
apiToken = tokenIsBase64 ? base64Utils.decodeBase64(apiToken, base64Utils.defaultRecursiveCount) : apiToken

/**
 * Instantiate an axios instance
 */
const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 8000,
  timeoutErrorMessage: '请求超时，请稍后再试',
  withCredentials: true,
  headers: {
    icode: apiToken,
  },
})

/**
 * Request interceptor
 */
instance.interceptors.request.use(
  config => {
    if (config.showLoading) showLoading()
    const token = storageUtils.get<string>('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error: AxiosError) => {
    hideLoading()
    return Promise.reject(error)
  }
)

/**
 * Info interceptor
 */
instance.interceptors.response.use(
  response => {
    hideLoading()

    const config = response.config
    const { data }: { data: Result } = response
    const { code, msg } = data

    if (debugEnable) log.debug(data)

    if (code === 500001) {
      return handleSessionExpired(msg, data)
    } else if (code !== 0) {
      return isFalse(config.showError) ? Promise.resolve(data) : handleError(msg, data)
    }

    return data.data
  },
  error => {
    hideLoading()
    return handleError(error.message, error)
  }
)

// Common error handling logic
function handleError(messageText: string, errorData: any) {
  message.error(messageText)
  return Promise.reject(errorData)
}

// Logic for handling session expiration
function handleSessionExpired(msg: string, data: any) {
  message.error(msg)
  storageUtils.remove('token')
  location.href = `${URIs.login}?callback=${encodeURIComponent(location.href)}`
  return Promise.reject(data)
}

/**
 * Encapsulating axios requests
 */
export default {
  get: function <T>(url: string, params?: any, options?: IRequestConfig): Promise<T> {
    return instance.get(url, { params, ...options })
  },
  post: function <T>(url: string, data?: object, options?: IRequestConfig): Promise<T> {
    return instance.post(url, data, options)
  },
  delete: function <T>(url: string, data?: any): Promise<T> {
    return instance.delete(url, { data })
  },
  put: function <T>(url: string, data?: any): Promise<T> {
    return instance.put(url, data)
  },
  getAuthHeaders: function () {
    return {
      icode: apiToken,
      Authorization: `Bearer ${storageUtils.get<string>('token')}`,
    }
  },
}
