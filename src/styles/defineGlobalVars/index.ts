import { theme } from 'ant-design-vue'
import custom from './custom'
import level from './level'
import fixedNeutralColor from './fixedNeutralColor'
import { defaultTheme } from '../../config'

export default function defineGlobalVars() {
  const { defaultAlgorithm, defaultSeed } = theme

  // 生成的全局变量见文件'./antDesignVars.example.ts'
  return {
    ...defaultAlgorithm({
      ...defaultSeed,
      ...defaultTheme
    }),
    ...custom,
    ...level,
    ...fixedNeutralColor
  }
}
