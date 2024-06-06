// 全局注册使用到的 ant icons
import type { App } from 'vue'
import {
  CaretDownOutlined,
  LogoutOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'

export default function setupAntIcon(app: App) {
  app.component('CaretDownOutlined', CaretDownOutlined)
  app.component('LogoutOutlined', LogoutOutlined)
  app.component('LoadingOutlined', LoadingOutlined)
}
