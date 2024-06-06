import { createHtmlPlugin } from 'vite-plugin-html'

export default function configHtmlPlugin() {
  // 其他预设配置
  return createHtmlPlugin({
    minify: true,
    inject: {
      data: {
        title: '钓鱼城分析系统'
      }
    }
  })
}
