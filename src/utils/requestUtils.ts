import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { hideLoading, showLoading } from '@/utils/loading'
import storageUtils from '@/utils/storageUtils.ts'
import { Result } from '@/types/apiTypes.ts'
import { log } from '@/common/logger.ts'
import { isDebugEnable } from '@/common/debugEnable.ts'

import { isFalse } from '@/common/isTrue.ts'
import { IRequestConfig } from '@/axios-conf'
import { base64Utils } from '@/common/base64Utils.ts'
import { message } from '@/utils/AntdHelper.ts'

/**
 * API Token
 */
const apiUriPrefix = import.meta.env.VITE_API_URI_PREFIX as string
let apiToken = import.meta.env.VITE_API_TOKEN as string
const tokenIsBase64 = base64Utils.isBase64(apiToken)
if (isDebugEnable) log.debug(`apiTokenIsBase64: ${tokenIsBase64}, apiToken: ${apiToken}`)
apiToken = tokenIsBase64 ? base64Utils.decodeBase64(apiToken, base64Utils.defaultRecursiveCount) : apiToken

/**
 * Instantiate an axios instance
 */
const instance: AxiosInstance = axios.create({
  baseURL: apiUriPrefix || '/api',
  timeout: 8000,
  timeoutErrorMessage: '请求超时，请稍后再试',
  withCredentials: true,
  headers: {
    icode: apiToken
  }
})

/**
 * Request interceptor
 */
instance.interceptors.request.use(
  config => {
    if (config.showLoading) showLoading()
    const token = storageUtils.get<string>('token')
    if (token) config.headers.Authorization = `Token::${token}`
    return config
  },
  (error: AxiosError) => {
    hideLoading()
    return Promise.reject(error)
  }
)

/**
 * Response interceptor
 */
instance.interceptors.response.use(
  response => {
    hideLoading()

    const config = response.config
    const { data }: { data: Result } = response
    const { code, msg } = data

    if (isDebugEnable) log.debug(data)

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
  message.error(messageText).then(() => {})
  return Promise.reject(errorData)
}

// Logic for handling session expiration
function handleSessionExpired(msg: string, data: any) {
  message.error(msg).then(() => {})
  storageUtils.remove('token')
  location.href = '/login'
  return Promise.reject(data)
}

/**
 * Encapsulating axios requests
 */
export default {
  get<T>(url: string, params?: any, options?: IRequestConfig): Promise<AxiosResponse<T>> {
    return instance.get<T>(url, { params, ...options })
  },
  post<T>(url: string, data?: object, options?: IRequestConfig): Promise<AxiosResponse<T>> {
    return instance.post<T>(url, data, options)
  },
  delete<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return instance.delete<T>(url, { data })
  },
  put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return instance.put<T>(url, data)
  }
}
