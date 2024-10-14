import { Button, ButtonProps } from 'antd'
import { useAuthInterceptorData } from '@/router/DefaultAuthLoader.ts'
import useZustandStore from '@/store/useZustandStore.ts'

interface DynamicBtnProps<T> extends ButtonProps {
  show: boolean // 是否显示按钮
  btnType?: string // 按钮类型
  extraData?: T // 额外数据
}

/**
 * 带权限的按钮的组件
 * @constructor
 * @example
 * <DynamicAtnButton show={false} onClick={() => alert('Hi')}>Dynamic Button</DynamicAtnButton>
 */
const DynamicAtnButton = <T,>({ show = true, btnType, extraData, children, ...props }: DynamicBtnProps<T>) => {
  const { buttons = [] } = useAuthInterceptorData()
  const { userInfo } = useZustandStore()
  const isSuperAdmin = userInfo?.role === 1
  const hasPermission = buttons.includes(btnType || '') // 根据用户按钮权限判断

  if (show && (isSuperAdmin || hasPermission)) {
    return <Button {...props}>{children}</Button>
  }

  return null
}

export default DynamicAtnButton
