/**
 * 在 App.tsx 中导入了 AntdGlobalProvider.ts 文件，并在 ConfigProvider 组件中使用了自定义主题, 入口处初始化 一次
 * @file Antd global message, notification and modal
 */
import { App } from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'

let message: MessageInstance
let notification: NotificationInstance
let modal: Omit<ModalStaticFunctions, 'warn'>

/**
 * 作为一个 Provider 组件，负责提供 Antd 全局的 message, notification, modal 实例
 */
export default function AntdGlobalProvider(): null {
  const staticFunction = App.useApp()
  message = staticFunction.message
  modal = staticFunction.modal
  notification = staticFunction.notification
  return null
}

export { message, notification, modal }

/**
 * AntD global theme variables
 */
export const useThemeToken = () => {
  const cssVariableValue = (variable: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
  }
  const colorPrimary = cssVariableValue('--color-primary')
  const borderRadius = cssVariableValue('--border-radius-default')
  return {
    token: { colorPrimary, borderRadius },
  }
}

/**
 * Hooks to use Antd global message, notification and modal
 */
export const useAntd = () => {
  return {
    message,
    modal,
    notification,
  }
}
