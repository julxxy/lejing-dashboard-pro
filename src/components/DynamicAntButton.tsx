import { Button, ButtonProps } from 'antd'
import useZustandStore from '@/store/useZustandStore.ts'
import useAuthLoaderData from '@/hooks/useAuthLoader.ts'

/**
 * 按钮操作类型定义
 */
type BtAction = 'add' | 'edit' | 'delete' | 'view' | 'other'

/**
 * 按钮的类型定义
 */
interface DynamicBtnProps<T> extends ButtonProps {
  /**
   * 显示状态
   */
  show: boolean
  /**
   * 操作类型
   */
  action?: BtAction
  /**
   * 数据载荷
   */
  payload?: T
}

/**
 * 带权限的按钮的组件
 * @constructor
 * @example
 * <DynamicAtnButton show={false} onClick={() => alert('Hello！')}>Dynamic Button</DynamicAtnButton>
 */
const DynamicAtnButton = <T,>({ show = true, action, payload, children, ...props }: DynamicBtnProps<T>) => {
  const { buttons = [] } = useAuthLoaderData()
  const { userInfo } = useZustandStore()
  const isSuperAdmin = userInfo?.role === 1
  const hasPermission = buttons.includes(action || '') // 根据用户按钮权限判断

  if (show || isSuperAdmin || hasPermission) {
    return <Button {...props}>{children}</Button>
  }

  return null
}

export default DynamicAtnButton
