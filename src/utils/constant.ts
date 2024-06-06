import type { InjectionKey } from 'vue'

export const TOKEN = 'token'
export const USER_INFOMATION = 'userInfo'
export const RESET_SCROLLBAR: InjectionKey<() => void> = Symbol()
export const SCROLL_BAR_WRAP: InjectionKey<any> = Symbol()

/**
 * @description: 请求头数据类型
 */
export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}

/**
 * @description: 刷新页面
 */
export const RELOAD: InjectionKey<() => void> = Symbol()

/**
 * @description: switch page
 */
export enum SwitchPage {
  PUSH = 'PUSH',
  REPLACE = 'REPLACE',
  BACK = 'BACK'
}
