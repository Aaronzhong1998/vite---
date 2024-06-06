import axios from 'utils/axios'
import type { RequestOptions } from '#/axios'

interface LoginRes {
  token: string
}

interface CheckSetionResult {
  code: 401 | 200
  msg: string
}

// 登录
const apiLogin = <T>(params?: T, options?: RequestOptions) =>
  axios.post<LoginRes, T>('/login', params, options)

// 登出
const apiLogout = <T>(params?: T, options?: RequestOptions) =>
  axios.delete<LoginRes, T>('/logout', params, options)

// 校验token有效性
const apiCheckSetion = () =>
  axios.post<CheckSetionResult, never>('/mulLogin', void 0, {
    isCheckSetion: true
  })

export { apiLogin, apiLogout, apiCheckSetion }
