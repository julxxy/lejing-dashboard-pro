import axios, { AxiosError, AxiosInstance } from 'axios'
import { hideLoading, showLoading } from '@/views/loading'
import storageUtils from '@/utils/storageUtils.ts'
import { Result } from '@/types/apiType.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'

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
if (isDebugEnable) log.debug(`API token is base64: ${tokenIsBase64}, apiToken: ${apiToken}`)
apiToken = tokenIsBase64 ? base64Utils.decode(apiToken, base64Utils.defaultRecursiveCount) : apiToken

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
 * Axios interceptor
 */
instance.interceptors.response.use(
  response => {
    hideLoading()
    const config = response.config

    if (
      config.responseType === 'blob' ||
      response.headers['content-type'] === 'blob' ||
      response.headers['content-type'] === 'application/octet-stream'
    ) {
      return response
    }

    const { data }: { data: Result } = response
    const { code, msg } = data

    if (isDebugEnable) log.debug(data)

    if (code === 500001) return handleSessionExpired(msg, data)
    if (code === 40001) return handleError(msg, data)
    if (code !== 0) return isFalse(config.showError) ? Promise.resolve(data) : handleError(msg, data)

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
  download(url: string, data: any, filename: string = 'DefaultFilename.xlsx') {
    instance({
      url,
      data,
      method: 'post',
      responseType: 'blob',
    }).then(response => {
      // Try to extract filename from 'content-disposition' or 'file-name' header
      let _filename = filename
      const contentDisposition = response.headers['content-disposition']
      const fileNameHeader = response.headers['file-name']

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''(.*)|filename="(.*)"/)
        if (fileNameMatch) {
          _filename = decodeURIComponent(fileNameMatch[1] || fileNameMatch[2])
        }
      } else if (fileNameHeader) {
        _filename = decodeURIComponent(fileNameHeader)
      }

      // Create a Blob from the response data and download the file
      const blob = new Blob([response.data], { type: response.data.type })
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.setAttribute('download', _filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)
    })
  },
  getAuthHeaders: function () {
    return {
      icode: apiToken,
      Authorization: `Bearer ${storageUtils.get<string>('token')}`,
    }
  },
}
