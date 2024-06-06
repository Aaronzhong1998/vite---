<template>
  <ConfigProvider
    :locale="zhCN"
    :theme="{ token: { ...defaultTheme, ...fixedNeutralColor } }"
  >
    <RouterView v-if="isRouterAlive" />
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { ConfigProvider } from 'ant-design-vue'
import { defaultTheme } from '@/config'
import fixedNeutralColor from '@/styles/defineGlobalVars/fixedNeutralColor'
import { useReload } from '@/hooks'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

const { isRouterAlive } = useReload()
</script>
