import { $t } from '@/hooks/useI18n'

// 数据源管理
export default {
  menuOrderNo: 0,
  route: {
    path: '/dataManage',
    name: 'DataManage',
    component: () => import('@/components/basicLayout/Index.vue'),
    redirect: '/dataManage/list',
    meta: {
      title: $t('dataManage.title')
    },
    children: [
      {
        path: 'list',
        name: 'DataManageList',
        meta: {
          isKeepAlive: true
        },
        component: () => import('@/views/dataManage/list/Index.vue')
      }
    ]
  }
}
