<template>
  <div class="scrollbar">
    <div
      ref="wrap"
      :class="[
        wrapClass,
        'scrollbar__wrap',
        { 'scrollbar__wrap--hidden-default': !native }
      ]"
      :style="style"
      @scroll="handleScroll"
    >
      <component
        ref="resize"
        :is="tag"
        :class="['scrollbar__view', viewClass]"
        :style="viewStyle"
      >
        <slot></slot>
      </component>
    </div>
    <template v-if="!native">
      <bar :move="moveX" :size="sizeWidth" />
      <bar vertical :move="moveY" :size="sizeHeight" />
    </template>
  </div>
</template>
<script setup lang="ts">
import { addResizeListener, removeResizeListener } from './resize-event'
import { toObject } from './util'
import {
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  provide,
  computed,
  unref,
  watch
} from 'vue'
import { useRoute } from 'vue-router'
import Bar from './bar'
import { RESET_SCROLLBAR, SCROLL_BAR_WRAP } from '@/constant'

defineOptions({ name: 'Scrollbar' })

const emit = defineEmits(['scroll', 'scrollToBottom'])
const props = defineProps({
  native: {
    type: Boolean,
    default: false
  },
  wrapStyle: {
    type: [String, Array],
    default: ''
  },
  wrapClass: {
    type: [String, Array],
    default: ''
  },
  viewClass: {
    type: [String, Array],
    default: ''
  },
  viewStyle: {
    type: [String, Array],
    default: ''
  },
  noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
  tag: {
    type: String,
    default: 'div'
  },
  // 在 X6 自定义节点组件中使用滚动条，组件中没有注册 router
  isInX6CustomNode: Boolean
})

const sizeWidth = ref('0')
const sizeHeight = ref('0')
const moveX = ref(0)
const moveY = ref(0)
const wrap = ref()
const resize = ref()

const style = computed(() => {
  if (Array.isArray(props.wrapStyle)) {
    return toObject(props.wrapStyle)
  }
  return props.wrapStyle
})

if (!props.isInX6CustomNode) {
  const route = useRoute()
  watch(
    () => route.path,
    () => {
      nextTick(update)
    }
  )
}
const scrollToTop = () => {
  unref(wrap).scrollTop = 0
}
const scrollToBottom = () => {
  unref(wrap).scrollTop = unref(wrap).scrollHeight
}

const handleScroll = () => {
  if (!props.native) {
    moveY.value = (unref(wrap)?.scrollTop * 100) / unref(wrap)?.clientHeight
    moveX.value = (unref(wrap)?.scrollLeft * 100) / unref(wrap)?.clientWidth
  }
  if (
    unref(wrap)?.scrollTop + unref(wrap)?.clientHeight ===
    unref(wrap)?.scrollHeight
  ) {
    emit('scrollToBottom')
  }
  emit('scroll', unref(wrap))
}

const update = () => {
  if (!unref(wrap)) return

  const heightPercentage =
    (unref(wrap).clientHeight * 100) / unref(wrap).scrollHeight
  const widthPercentage =
    (unref(wrap).clientWidth * 100) / unref(wrap).scrollWidth

  sizeHeight.value = heightPercentage < 100 ? `${heightPercentage}%` : ''
  sizeWidth.value = widthPercentage < 100 ? `${widthPercentage}%` : ''
}

provide(SCROLL_BAR_WRAP, wrap)
provide(RESET_SCROLLBAR, () => {
  nextTick(update)
})

onMounted(() => {
  if (props.native) return
  nextTick(update)
  if (!props.noresize) {
    addResizeListener(unref(resize), update)
    addResizeListener(unref(wrap), update)
    addEventListener('resize', update)
  }
})

onBeforeUnmount(() => {
  if (props.native) return
  if (!props.noresize) {
    removeResizeListener(unref(resize), update)
    removeResizeListener(unref(wrap), update)
    removeEventListener('resize', update)
  }
})

defineExpose({
  scrollToTop,
  scrollToBottom
})
</script>
<style lang="less" scoped>
.scrollbar {
  position: relative;
  height: 100%;
  overflow: hidden;

  &__wrap {
    height: 100%;
    overflow: auto;

    &--hidden-default {
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        opacity: 0;
      }
    }
  }
}

:deep(.scrollbar__thumb) {
  position: relative;
  display: block;
  width: 0;
  height: 0;
  background-color: @colorScrollbar;
  border-radius: inherit;
  transition: 0.3s background-color;

  &:hover,
  &:active {
    background-color: @colorScrollbarHover;
  }
}

:deep(.scrollbar__bar) {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 1;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 80ms ease;

  &.is-vertical {
    top: 2px;
    width: unit(@sizeScrollbar, px);

    & > div {
      width: 100%;
    }
  }

  &.is-horizontal {
    left: 2px;
    height: unit(@sizeScrollbar, px);

    & > div {
      height: 100%;
    }
  }
}

.scrollbar:active > :deep(.scrollbar__bar),
.scrollbar:focus > :deep(.scrollbar__bar),
.scrollbar:hover > :deep(.scrollbar__bar) {
  opacity: 1;
  transition: opacity 340ms ease-out;
}
</style>
