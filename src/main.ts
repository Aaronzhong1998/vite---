import { createApp } from 'vue'
import setupStore from './store'
import setupRoute from './router'
import setupRouterGuard from './router/guard'
import setupI18n from './locale'
import initAppConfig from 'utils/initAppConfig'
import setupErrorHandle from 'utils/errorHandle'
import setupAntdConfig from 'utils/antComponent'
import setupGlobalComponents from 'utils/setupGlobalComponents'
import setupGlobDirectives from '@/directives'

import App from './App.vue'

import './styles/index.less'
import './assets/iconfont/iconfont.css'

async function bootstrap() {
  const app = createApp(App)

  // 全局共用自定义组件/图标
  setupGlobalComponents(app)

  setupAntdConfig()

  // 配置 store
  setupStore(app)

  // 初始化系统配置
  await initAppConfig()

  // 多语言配置
  setupI18n(app)

  // 配置路由
  setupRoute(app)

  // 路由守卫
  setupRouterGuard()

  // 全局指令
  setupGlobDirectives(app)

  // 配置全局错误处理
  setupErrorHandle(app)

  app.mount('#app')
}

bootstrap()
