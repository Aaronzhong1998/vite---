<template>
  <section :class="prefixCls">
    <a-menu
      v-model:selectedKeys="current"
      mode="horizontal"
      @click="handleMenuClick"
    >
      <a-menu-item v-for="item in menus" :key="item.name">
        <ItemContent :item="item.meta" />
      </a-menu-item>
    </a-menu>
  </section>
</template>

<script setup lang="ts">
import { ref, watchEffect, inject } from 'vue'
import { usePrefix, useSwitchPage, useSearchKey } from '@/hooks'
import { router } from '@/router'
import { useRoute, type RouteRecordName } from 'vue-router'
import ItemContent from './ItemContent.vue'
import { keepAliveStore } from '@/store/modules/keepAlive'
import { RELOAD } from '@/constant'

const { prefixCls } = usePrefix('menu')
const switchPage = useSwitchPage()
const store = keepAliveStore()
const route = useRoute()
const routes = router.getRoutes()
const reload = inject(RELOAD)!

const regExpPath = /^\/\w+(?=\/)/
const menus = routes.filter(
  (routeItem) => !regExpPath.test(routeItem.path) && routeItem.meta.title
)

// 读取当前目录
const current = ref<RouteRecordName[]>([])

watchEffect(() => {
  const path = regExpPath.exec(router.currentRoute.value.path)
  if (!path) return []
  const currentMenu = menus.find((item) => item.path === path[0]) || menus[0]
  current.value = [currentMenu.name || '']
})

// 点击目录操作
const handleMenuClick = (option: { key: string }) => {
  const tagNames = [...store.tagNames]
  const rootRoute = route.matched.find((item) => item.name === option.key)
  if (
    route.name &&
    tagNames.includes(route.name) &&
    rootRoute &&
    rootRoute.redirect === route.path
  ) {
    // 刷新当前目录
    reload()
    return
  }

  store.clearTagName()
  useSearchKey().clearSearchKey()
  switchPage({ name: option.key })
}
</script>

<style scoped lang="less">
@prefix-cls: ~'menu';

.@{prefix-cls} {
  flex: 1;
}

:deep(.ant-menu) {
  height: 4rem;
  font-size: 1rem;
  line-height: 4rem;
  background-color: transparent;

  .ant-menu-item {
    padding-inline: 1.5rem;
    color: @colorHeaderText;

    &::after {
      inset-inline: 1.5rem;
      transition: border-color 0.1s;
    }

    .ant-menu-item-active,
    &:hover:not(.ant-menu-item-selected) {
      color: @colorPrimary;
    }
  }

  .ant-menu-item-selected {
    font-weight: 600;
    color: @colorPrimary;
  }
}
</style>
