import type { RouteRecordRaw } from 'vue-router'

export const login404: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'Error',
  component: () => import('@/components/basicLayout/Index.vue'),
  children: [
    {
      path: '/:pathMatch(.*)*',
      name: 'Error',
      component: () => import('@/views/error/Index.vue')
    }
  ]
}
export const logout404: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'Error',
  meta: {
    isLogout: true
  },
  component: () => import('@/views/error/Index.vue')
}
