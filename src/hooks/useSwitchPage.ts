import type { RouteLocationNamedRaw, Router } from 'vue-router'
import { useRouter } from 'vue-router'
import { SwitchPage } from '@/constant'
import { isString } from 'utils/is'
import { useSearchKey } from '@/hooks'

export type SwitchPageOptionProps = RouteLocationNamedRaw | SwitchPage

export default function useSwitchPage(router: Router = useRouter()) {
  const { push, replace, back } = router
  const switchType = {
    [SwitchPage.PUSH]: push,
    [SwitchPage.REPLACE]: replace,
    [SwitchPage.BACK]: back
  }
  return function (option: SwitchPageOptionProps, type = SwitchPage.PUSH) {
    if (isString(option)) {
      switchType[type](option)
      return
    }

    if (option.name) {
      // 路由跳转带上pinia缓存的搜索值
      if (useSearchKey().searchMapping[option.name]) {
        switchType[type]({
          ...option,
          query: {
            ...option.query,
            search: useSearchKey().searchMapping[option.name]
          }
        })
        return
      }

      switchType[type](option)
    }
  }
}
