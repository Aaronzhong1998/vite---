<template>
  <main :class="prefixCls">
    <div :class="`${prefixCls}__header`">
      <Logo />
      <Menu />
      <UserInfo />
    </div>
    <comp-scrollbar>
      <CompContent />
    </comp-scrollbar>
  </main>
</template>

<script setup lang="ts">
import { Logo, UserInfo } from 'components/headApplication'
import Menu from 'components/headMenu/Index.vue'
import CompContent from './CompContent.vue'
import { usePrefix } from '@/hooks'

const { prefixCls } = usePrefix('basic-layout')
</script>

<style scoped lang="less">
@prefix-cls: ~'basic-layout';

.@{prefix-cls} {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background-color: @colorBgLayout;
  background-size: 100%;

  &__header {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    width: 100vw;
    min-height: 4rem;
    padding: 0 2rem;
    overflow: hidden;
    background: @colorBgHeader;
  }
}
</style>
