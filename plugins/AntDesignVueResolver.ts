import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default function AntDesignVueResolverPlugin() {
  // 其他预设配置
  return Components({
    directoryAsNamespace: true,
    resolvers: [
      AntDesignVueResolver({
        importStyle: false // css in js
      })
    ]
  })
}
