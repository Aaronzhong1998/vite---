<template>
  <div :class="prefixCls" @click="handleGoHome">
    <img
      :class="`${prefixCls}__logo`"
      :src="getImageUrl('system_logo_light.svg')"
      alt="logo"
    />
    <div :class="`${prefixCls}__title`">
      <span>{{ $t('fields.title') }}</span>
      <div :class="`${prefixCls}__sub-title`">
        <span :class="`${prefixCls}__slice`">Powered by</span>
        <span>{{ $t('fields.subTitle') }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePrefix, useSwitchPage, useAssetsImages } from '@/hooks'

defineOptions({ name: 'Logo' })
const { prefixCls } = usePrefix('app-logo')
const switchPage = useSwitchPage()
const getImageUrl = (name: string) => useAssetsImages(`/${name}`)

const handleGoHome = () => {
  switchPage({ name: '' })
}
</script>
<style lang="less" scoped>
@prefix-cls: ~'app-logo';

.@{prefix-cls} {
  display: inline-flex;
  flex: 1;
  align-items: center;
  min-width: 12rem;
  max-width: 15rem;
  height: 100%;
  cursor: pointer;

  &__logo {
    width: 2rem;
    height: 2rem;
  }

  &__title {
    margin-left: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.5rem;
    color: @colorHeaderText;
  }

  &__sub-title {
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.3;
    color: @colorHeaderTextTertiary;
  }

  &__slice {
    margin-right: 0.3rem;
    font-weight: initial;
  }
}
</style>
