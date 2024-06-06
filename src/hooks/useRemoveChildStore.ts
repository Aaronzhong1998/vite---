import { useSearchKey } from '@/hooks'
import { keepAliveStore } from '@/store/modules/keepAlive'
import type { RouteRecordName } from 'vue-router'

// 父子页面映射（父子页面均设置keepAive与搜索值缓存）
const parentMapping: Record<RouteRecordName, Array<RouteRecordName>> = {}

// 后退、返回后移除之前页面（子页面）的keepAlive和搜索值缓存
export default function useRemoveChildStore(name: RouteRecordName) {
  if (parentMapping[name]?.length) {
    // 移除 keepAlive
    const store = keepAliveStore()
    store.setTagName(
      store.tagNames.filter((tagName) => !parentMapping[name].includes(tagName))
    )
    // 移除搜索值
    parentMapping[name].forEach((item) => {
      useSearchKey().childClearSearchMapping[item] &&
        useSearchKey().childClearSearchMapping[item]()
    })
  }
}
