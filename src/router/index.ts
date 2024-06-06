import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import basicRoute from './basic'
import { login404, logout404 } from './error'
import { TOKEN } from '@/constant'

interface File {
  default: { menuOrderNo: number; route: RouteRecordRaw }
}

const files = import.meta.glob('./default/*.ts', { eager: true })
const defaultRoutes: RouteRecordRaw[] = []

for (const path in files) {
  const file = files[path] as File
  defaultRoutes[file.default.menuOrderNo] = file.default.route
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...basicRoute,
    ...defaultRoutes,
    window.localStorage.getItem(TOKEN) ? login404 : logout404
  ]
})

export default function setupRoute(app: App<Element>) {
  app.use(router)
}
