import { nextTick, provide, ref } from 'vue'
import { RELOAD } from '@/constant'

export default function useReload() {
  const isRouterAlive = ref(true)
  async function reload() {
    isRouterAlive.value = false
    await nextTick()
    isRouterAlive.value = true
  }
  provide(RELOAD, reload)

  return { isRouterAlive }
}
