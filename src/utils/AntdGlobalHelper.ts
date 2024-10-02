/**
 * 在 App.tsx 中导入了 AntdHelper.ts 文件，并在 ConfigProvider 组件中使用了自定义主题, 入口处初始化 一次
 * @file Antd global message, notification and modal
 */
import { App } from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'

let message: MessageInstance
let notification: NotificationInstance
let modal: Omit<ModalStaticFunctions, 'warn'>

export default function AntdGlobalHelper() {
  const staticFunction = App.useApp()
  message = staticFunction.message
  modal = staticFunction.modal
  notification = staticFunction.notification
  return null
}

export { message, notification, modal }

export const useAntdMessage = () => {
  return {
    message: message,
    notification: modal,
    modal: notification
  }
}
