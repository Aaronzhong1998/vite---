import { fileURLToPath, URL } from 'node:url'
import { loadEnv, defineConfig } from 'vite'
import createPlugins from './plugins'
import defineGlobalVars from './src/styles/defineGlobalVars'
import { basename } from 'path'

import {
  Languages,
  esbuildPluginMonacoEditorNls
} from './plugins/MonacoPlugins/Nls'
import zh_hans from './plugins/MonacoPlugins/zh-hans.json'

export default defineConfig(({ command, mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const isBuild = command === 'build'

  // 修复href跳转proxy丢失参数的问题
  let originalUrl = ''

  return {
    root,
    server: {
      host: true,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          prependPath: false,
          rewrite: () => originalUrl.replace(/^\/api/, ''),
          bypass: (res, req, option) => {
            // @ts-ignore
            originalUrl = res.originalUrl
            console.log(`${originalUrl} ~> ${option.target}`)
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: defineGlobalVars(),
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/defineGlobalMixin/index.less";'
        }
      }
    },
    plugins: createPlugins(isBuild),
    resolve: {
      alias: {
        '#': fileURLToPath(new URL('./src/types', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        api: fileURLToPath(new URL('./src/api', import.meta.url)),
        components: fileURLToPath(new URL('./src/components', import.meta.url)),
        utils: fileURLToPath(new URL('./src/utils', import.meta.url))
      }
    },
    test: {
      global: true,
      environment: 'happy-dom'
    },
    // 生产环境打包配置
    build: {
      minify: 'terser',
      terserOptions: {
        // 去除 console debugger
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    RollupOptions: {
      output: {
        assetFileNames(chunkInfo: { name: string }) {
          if (chunkInfo.name) {
            const [name, ext] = basename(chunkInfo.name).split('.')
            return `assets/${name.toLocaleLowerCase()}-fishing.${ext}`
          }
          return ''
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          // 开发环境下通过esbuild插件进行汉化
          esbuildPluginMonacoEditorNls({
            locale: Languages.zh_hans,
            localeData: zh_hans
          })
        ]
      }
    }
  }
})
