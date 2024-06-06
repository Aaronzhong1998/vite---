export * from './injectionKeys'
export * from './const'
export * from './enum'
import constantConfig from '@/config/default'

// heartbeat
export const HEARTBEAT = 'HEARTBEAT'

// theme mode
export const THEME_MODE: {
  DARK: string
  LIGHT: string
} = constantConfig.THEME_MODE

export default {
  HEARTBEAT,
  THEME_MODE
}
