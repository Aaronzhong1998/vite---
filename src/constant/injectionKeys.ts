import type { InjectionKey } from 'vue'

/**
 * @description: 滚动组件重置
 */
export const RESET_SCROLLBAR: InjectionKey<() => void> = Symbol()

/**
 * @description: 滚动组件滚动事件
 */
export const SCROLL_BAR_WRAP: InjectionKey<any> = Symbol()

/**
 * @description: 刷新页面
 */
export const RELOAD: InjectionKey<() => void> = Symbol()
