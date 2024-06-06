import setupCustomComponent from './customComponent'
import setupAntIcon from './antIcon'
import type { App } from 'vue'
export default function setupGlobalComponent(app: App) {
  setupCustomComponent(app)
  setupAntIcon(app)
}
