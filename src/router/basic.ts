import type { RouteRecordRaw } from 'vue-router'

const basicRoute: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Index.vue')
  }
]

export default basicRoute
