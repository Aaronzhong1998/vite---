import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

import zh_CN from './zh_CN'
import en_US from './en_US'

export const i18nInstance = createI18n({
  locale: 'zh_CN',
  legacy: false,
  messages: {
    zh_CN,
    en_US
  }
})
export default async function setupI18n(app: App<Element>) {
  app.use(i18nInstance)
}
