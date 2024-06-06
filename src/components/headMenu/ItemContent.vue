<template>
  <span :class="prefixCls">
    {{ $t(item.title!) }}
  </span>
</template>
<script setup lang="ts">
import { usePrefix } from '@/hooks'

const { prefixCls } = usePrefix('menu-item-content')
defineProps<{
  item: {
    icon?: string
    title?: string
  }
}>()
</script>
<style lang="less" scoped>
@prefix-cls: ~'menu-item-content';

.@{prefix-cls} {
  display: flex;
  align-items: center;
}
</style>
