import { StyleValue } from 'vue'

interface RenderThumbStyle {
  size?: string
  move?: number
  bar: BarMapItem
}

export interface BarMapItem {
  offset: 'offsetWidth' | 'offsetHeight'
  scroll: string
  scrollSize: string
  size: string
  key: string
  axis: string
  client: 'clientX' | 'clientY'
  direction: 'top' | 'left'
}
export interface BarMap {
  vertical: BarMapItem
  horizontal: BarMapItem
}

export const BAR_MAP: BarMap = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top'
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left'
  }
}

export function renderThumbStyle({
  size,
  move,
  bar
}: RenderThumbStyle): Record<string, unknown> {
  const style: Record<string, unknown> = {}
  const translate = `translate${bar.axis}(${move}%)`

  style[bar.size] = size
  style.transform = translate
  style.msTransform = translate
  style.webkitTransform = translate

  return style
}

function extend<T, K>(to: T, _from: K) {
  return Object.assign({}, to, _from)
}

export function toObject<T>(arr: Array<T>): StyleValue {
  let res = {}
  for (const element of arr) {
    if (element) {
      res = extend(res, element)
    }
  }
  return res
}
