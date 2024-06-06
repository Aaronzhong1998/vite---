<template>
  <section :class="contentClass">
    <section :class="`${prefixCls}__content`">
      <router-view v-slot="{ Component }">
        <keep-alive :include="tagNames as string[]">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </section>
  </section>
</template>
<script setup lang="ts">
import { usePrefix } from '@/hooks'
import { useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import { LayoutType } from '@/constant'
import { keepAliveStore } from '@/store/modules/keepAlive'

const { prefixCls } = usePrefix('basic-layout')
const route = useRoute()
const store = keepAliveStore()

const contentClass = computed(() => {
  return route.meta?.layoutType === LayoutType.CONTENT
    ? ``
    : `${prefixCls}__container`
})

const tagNames = computed(() => store.tagNames || [])

watch(
  () => route.meta?.isKeepAlive,
  (newValue) => {
    if (newValue && route.name && !tagNames.value.includes(route.name)) {
      store.addTagName(route.name)
    }
  },
  { deep: true, immediate: true }
)
</script>
<style scoped lang="less">
@prefix-cls: ~'basic-layout';
@paddingWight: 0.75rem;

.@{prefix-cls} {
  &__container {
    display: flex;
    min-width: unit(@layoutMinWidth, rem);
    height: calc(100vh - 7.5rem);
    min-height: unit(@layoutMinHeight, rem);
    padding: @paddingWight;
  }

  &__content {
    position: relative;
    width: 100%;
    min-width: unit(@layoutMinWidth, rem);
    background-color: @colorBgLayout;
  }
}
</style>
