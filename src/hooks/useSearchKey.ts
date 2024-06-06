// import { searchKeyStore } from '@/store/modules/searchKey'
import type { RouteRecordName } from 'vue-router'

// 获取搜索关键词
export default function useSearchKey() {
  // const store = searchKeyStore()

  // 获取各模块搜索key，路由名与搜索值映射
  const searchMapping: Record<RouteRecordName, string> = {}
  const searchFnMapping: Record<RouteRecordName, (key: string) => void> = {}

  // 清空各模块搜索值
  const clearMaps: Record<string, () => void> = {}

  // 子页面路由名与搜索函数映射
  const childClearSearchMapping: Record<RouteRecordName, () => void> = {}

  // 清空所有模块搜索key
  const clearSearchKey = () => {
    Object.keys(clearMaps).forEach((key) => {
      console.log(key)
    })
  }

  return {
    searchMapping,
    searchFnMapping,
    childClearSearchMapping,
    clearSearchKey
  }
}
