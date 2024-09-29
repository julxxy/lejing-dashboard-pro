import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { message } from 'antd'
import { hideLoading, showLoading } from '@/utils/loading'
import storage from '@/utils/storage.ts'

/**
 * 实例化 axios 实例
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URI,
  timeout: 8000,
  timeoutErrorMessage: '请求超时，请稍后再试',
  withCredentials: true
})

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  config => {
    showLoading()
    const token = storage.get<string>('token')
    if (token) {
      config.headers.Authorization = `Token:: ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    hideLoading()
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  response => {
    hideLoading()
    const { data } = response
    const { code, msg } = data
    switch (code) {
      case 500001:
        message.error(msg)
        storage.remove('token')
        location.href = '/login'
        break
      case 0:
        return data.data // 返回数据
      default:
        message.error(msg)
        return Promise.reject(data) // 抛出错误
    }
  },
  error => {
    hideLoading()
    message.error(error.message)
    return Promise.reject(error)
  }
)

/**
 * 封装axios请求
 */
export default {
  get: <T>(url: string, params?: object): Promise<AxiosResponse<T>> => instance.get<T>(url, { params }),
  post: <T>(url: string, data?: object): Promise<AxiosResponse<T>> => instance.post<T>(url, data),
  delete: <T>(url: string, data?: any): Promise<AxiosResponse<T>> => instance.delete<T>(url, { data }),
  put: <T>(url: string, data?: any): Promise<AxiosResponse<T>> => instance.put<T>(url, data)
}
