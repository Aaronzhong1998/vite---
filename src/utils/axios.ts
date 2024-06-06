import type { RequestOptions, Result, RequestConfig } from '#/axios'
import type {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError
} from 'axios'
import axios from 'axios'
import { isDef } from 'utils/is'
import { message } from 'ant-design-vue'
import { i18nInstance } from '@/locale'
import { removeStorage } from '@/utils/util'
import { isString } from '@/utils/is'
import { TOKEN, USER_INFOMATION, ContentTypeEnum } from '@/constant'

const $t = i18nInstance.global.t

class Axios {
  private readonly options: AxiosRequestConfig
  private axiosInstance: AxiosInstance
  private isTokenInValid = false

  constructor(options: AxiosRequestConfig) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  private callError(e: unknown | Error, isErrorCatchBySelf = false) {
    if (e instanceof Error || isErrorCatchBySelf || !e || !isString(e)) {
      return
    }
    message.error(e)
  }

  // 获取token
  private getToken() {
    const token = window.localStorage.getItem(TOKEN) || void 0
    return token && `Bearer ${token}`
  }

  // 处理get请求的入参
  private handleGetUrl(url: string, params: Record<string, any>) {
    let paramString = ''
    for (const key of Object.keys(params)) {
      const val = params[key]
      if (val === null || typeof val === 'undefined') {
        continue
      }
      paramString += `${key}=${encodeURIComponent(val)}&`
    }
    return `${url}?${paramString.slice(0, -1)}`
  }

  private requestInterceptors(config: RequestConfig) {
    const { params, method } = config
    let { url } = config

    // axios无法转译[]，使用自定义参数编码
    if (params && url && method === 'get') {
      url = this.handleGetUrl(url, params)
      config.params = {}
    }

    // 登录接口不允许传token
    if (url && !/\/login$/.test(url) && this.getToken()) {
      config.headers = {
        ...config.headers,
        Authorization: this.getToken()!
      }
    }

    return { ...config, url } as InternalAxiosRequestConfig
  }

  private responseInterceptorsCatch(error: AxiosError) {
    const response = error.response

    // 网络错误
    if (error.message && error.message === 'Network Error') {
      message.error($t('message.networkError'))
    }
    // 客户端请求超时
    else if (error.message && error.message.includes('timeout')) {
      message.error($t('message.timeout'))
    }
    // 客户端错误
    else if (/^4/.test(String(error.status))) {
      window.location.href = `/error`
    }
    // 服务端错误
    else if (/^5/.test(String(error.status))) {
      message.error($t('message.serverError'))
    }

    if (!response) throw error

    // 服务器内部请求超时
    if (response.statusText.includes('Gateway Timeout')) {
      message.error($t('message.timeout'))
    }
    // 服务端内部错误
    else if (/^5/.test(String(response.status))) {
      message.error($t('message.serverError'))
    }

    throw error
  }

  private responseHook<T>(
    result: AxiosResponse<Result<T>>,
    options: RequestOptions
  ): any {
    const { isNativeResponse, isNativeData } = options

    // 返回包含原生响应头
    if (isNativeResponse) {
      return result
    }

    // 返回业务数据+状态数据
    if (isNativeData) {
      return result.data
    }

    if (!result.data) {
      throw new Error()
    }

    // 返回业务数据
    const { code, data, msg } = result.data
    const errorStatus = [400, 500, 415]
    const customStatus = [304, 502, 405]
    const redirStatus = [404]
    const tokenInValid = [401]

    // 抛出后端报错
    if (errorStatus.includes(code)) {
      throw msg
    }

    // 携带具体错误信息
    if (customStatus.includes(code)) {
      throw result.data
    }

    // 直接重定向错误页面
    if (redirStatus.includes(code)) {
      window.location.href = `/error`
    }

    // token失效
    if (tokenInValid.includes(code) && this.isTokenInValid) return
    if (tokenInValid.includes(code) && !options?.isCheckSetion) {
      const tokenInvalid = $t('message.tokenInvalid')
      removeStorage(TOKEN, USER_INFOMATION)
      this.isTokenInValid = true
      setTimeout(() => {
        window.location.href = !['/', '/login'].includes(
          window.location.pathname
        )
          ? '/?redirect=' +
            window.location.pathname +
            window.location.search.replaceAll('&', '%26') +
            window.location.hash.replace('#', '%23')
          : '/login'
      }, 1000)
      throw tokenInvalid
    }

    return isDef(data) ? data : result.data
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use((config) => {
      return this.requestInterceptors(config)
    }, undefined)

    this.axiosInstance.interceptors.response.use(undefined, (error) => {
      this.responseInterceptorsCatch(error)
    })
  }

  private request<T>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    const requestConfig: RequestConfig = Object.assign({}, config)

    if (options?.contentType) {
      requestConfig.headers = requestConfig.headers || {}
      requestConfig.headers['Content-Type'] = options.contentType
    }

    if (options?.onUploadProgress) {
      requestConfig.onUploadProgress = options.onUploadProgress
    }

    if (options?.cancelToken) {
      requestConfig.cancelToken = options.cancelToken
    }

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<T, AxiosResponse<Result<T>>>(requestConfig)
        .then((result: AxiosResponse<Result<T>>) => {
          if (result) {
            try {
              resolve(this.responseHook<T>(result, options || {}))
            } catch (e) {
              reject(e)
              // 默认报错统一弱提示
              this.callError(e, options?.isErrorCatchBySelf)
              return
            }
            resolve(result as unknown as Promise<T>)
          }
        })
        .catch((e: Error | AxiosError) => {
          reject(e)
        })
    })
  }

  public get<T, D>(
    url: string,
    params?: D,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>({ url, params, method: 'GET' }, options)
  }

  public post<T, D>(
    url: string,
    params?: D,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>({ url, data: params, method: 'POST' }, options)
  }

  public put<T, D>(
    url: string,
    params?: D,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>({ url, data: params, method: 'PUT' }, options)
  }

  public delete<T, D>(
    url: string,
    params?: D,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>({ url, data: params, method: 'DELETE' }, options)
  }

  public downloadBigFileByHref = <T extends { id: string; type?: string }>(
    url: string,
    params?: T
  ) =>
    `${this.options.baseURL}${url}?id=${params!.id}&type=${
      params!.type
    }&token=${localStorage.getItem(TOKEN)}`

  public downloadDataStatisticByHref = (url: string, params?: any) =>
    `${this.options.baseURL}${url}?startTime=${
      params.startTime || ''
    }&endTime=${params.endTime || ''}&code=${
      params.code
    }&token=${localStorage.getItem(TOKEN)}`
}

const axiosInstance = new Axios({
  baseURL: `/api`,
  timeout: 20 * 1000,
  headers: { 'Content-Type': ContentTypeEnum.JSON }
})

export default axiosInstance
