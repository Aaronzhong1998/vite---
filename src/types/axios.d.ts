import type { AxiosRequestConfig } from 'axios'

export interface RequestOptions {
  isNativeResponse?: boolean
  isNativeData?: boolean
  isCheckSetion?: boolean
  isErrorCatchBySelf?: boolean
  isCheckProductionLine?: boolean
  // 上传相关
  contentType?: string
  cancelToken?: CancelToken
  onUploadProgress?: (progressEvent: any) => void
}

export interface RequestConfig extends AxiosRequestConfig {
  requestOptions?: RequestOptions
}

export interface Result<T> {
  code: number
  msg: string
  data: T
}
