<template>
  <section :class="[prefixCls, { logout: isLogout }]">
    <div :class="`${prefixCls}__wrap`">
      <img :src="useAssetsImages('/404.svg')" alt="error" />
      <div :class="`${prefixCls}__msg global-locale__error__msg`">
        <span>{{ $t('message.error404') }}</span>
        <br />
        <span>{{ $t('message.error404Tip') }}</span>
        <a-button
          v-if="isLogout"
          type="link"
          :class="`${prefixCls}__btn`"
          @click="switchPage({ name: 'Login' })"
        >
          {{ $t('actions.toLogin') }}
        </a-button>
        <a-button
          v-else
          type="link"
          :class="`${prefixCls}__btn`"
          @click="switchPage({ name: 'RuleDiscovery' })"
        >
          {{ $t('actions.toHome') }}
        </a-button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePrefix, useSwitchPage, useAssetsImages } from '@/hooks'
const { prefixCls } = usePrefix('error')

const route = useRoute()
const isLogout = ref(route.meta.isLogout)
const switchPage = useSwitchPage()
</script>

<style lang="less" scoped>
@prefix-cls: ~'error';
.@{prefix-cls} {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 8rem);
  background: @colorBgContainer;

  &.logout {
    height: 100vh;
  }

  &__wrap {
    position: relative;
    width: 30rem;
    height: 30rem;
    transform: translateY(-15%);
  }

  &__msg {
    position: absolute;
    bottom: 4.5rem;
    left: 5rem;
    line-height: 1.5rem;
    color: @colorTextSecondary;
    text-align: center;
  }

  &__btn {
    padding: 0.25rem 0;
  }
}
</style>
