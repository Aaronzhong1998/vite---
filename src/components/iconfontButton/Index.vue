<template>
  <div
    :class="[
      `${prefixCls}`,
      { [`${prefixCls}-default`]: type === 'default' },
      { [`${prefixCls}-disabled`]: disabled || loading },
      {
        [`${prefixCls}-default-disabled`]:
          type === 'default' && (disabled || loading)
      },
      {
        [`${prefixCls}-no-iconfont`]: !iconfont
      }
    ]"
  >
    <LoadingOutlined class="iconfont" v-if="loading" />
    <span v-else-if="iconfont">
      <span
        v-if="iconfont.includes('icon-')"
        :class="`iconfont ${iconfont}`"
      ></span>
      <component v-else class="iconfont" :is="iconfont"></component>
    </span>
    <span :class="`${prefixCls}__desc`">{{ description }}</span>
  </div>
</template>

<script setup lang="ts">
import { usePrefix } from '@/hooks'

const { prefixCls } = usePrefix('iconfont-button')

defineOptions({ name: 'IconfontButton' })
defineProps({
  iconfont: String,
  description: String,
  loading: Boolean,
  type: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'iconfont-button';

.@{prefix-cls} {
  position: relative;
  height: 1.5rem;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  color: @colorPrimary;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: @colorPrimaryHover;
  }

  .anticon-loading {
    position: absolute;
    top: 50%;
    left: 0;
    line-height: 1;
    transform: translateY(-50%);
  }

  .iconfont {
    position: absolute;
    top: 50%;
    left: 0;
    line-height: 1;
    transform: translateY(-50%);
  }

  &__desc {
    line-height: 1.5rem;
  }

  &-default {
    color: @colorTextTertiary;

    &:hover {
      color: @colorPrimary;
    }
  }

  &-disabled {
    color: @colorPrimaryDisabled;
    cursor: not-allowed;

    &:hover {
      color: @colorPrimaryDisabled;
    }
  }

  &-default-disabled {
    color: @colorTextQuaternary;

    &:hover {
      color: @colorTextQuaternary;
    }
  }

  &-no-iconfont {
    padding-left: 0;
  }
}
</style>
