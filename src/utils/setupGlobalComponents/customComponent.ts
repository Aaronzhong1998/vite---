// 全局注册自定义组件
import type { App } from 'vue'

import CompScrollbar from 'components/scrollbar/Index.vue'
import CompIconfontButton from 'components/iconfontButton/Index.vue'

export default function setupCustomComponent(app: App) {
  app.component('CompScrollbar', CompScrollbar)
  app.component('CompIconfontButton', CompIconfontButton)
}
