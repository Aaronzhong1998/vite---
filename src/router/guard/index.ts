import { router } from '@/router'
import { Modal } from 'ant-design-vue'
import { useRemoveChildStore, useSearchKey } from '@/hooks'

export default function setupRouterGuard() {
  router.beforeEach((to, _from, next) => {
    Modal.destroyAll()

    if (to.name) {
      // 当路由搜索值与缓存不相同时，设置搜索缓存
      console.log(useSearchKey().searchMapping[to.name])
      if (
        useSearchKey().searchFnMapping[to.name] &&
        useSearchKey().searchMapping[to.name] !== to.query.search
      ) {
        useSearchKey().searchFnMapping[to.name](
          (to.query.search as string) || ''
        )
      }
      // 清除子页面缓存
      useRemoveChildStore(to.name)
    }
    next()
  })
  router.afterEach(() => {
    // TODO
  })
}
