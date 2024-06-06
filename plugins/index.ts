import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteCompression from 'vite-plugin-compression'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import eslintPlugin from '@nabla/vite-plugin-eslint'
import legacyPlugin from '@vitejs/plugin-legacy'

import configHtmlPlugin from './html'
import AntDesignVueResolverPlugin from './AntDesignVueResolver'
import MonacoEditorPlugin from './MonacoPlugins/EditorPlugin'

import nlsPlugin, { Languages } from './MonacoPlugins/Nls'
import zh_hans from './MonacoPlugins/zh-hans.json'

export default function createPlugins(isBuild: boolean) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    vue(),
    vueJsx(),
    mockDevServerPlugin(),
    eslintPlugin(),
    configHtmlPlugin(),
    AntDesignVueResolverPlugin(),
    MonacoEditorPlugin(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    })
  ]

  isBuild &&
    vitePlugins.push(
      legacyPlugin({
        targets: ['chrome 52', 'firefox 68', 'edge 79'],
        modernPolyfills: true
      }),
      nlsPlugin({
        locale: Languages.zh_hans,
        localeData: zh_hans
      })
    )

  return vitePlugins
}
