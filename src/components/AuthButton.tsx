import { useAuthLoaderData } from '@/router/DefaultAuthLoader.ts'
import useZustandStore from '@/store/useZustandStore.ts'
import { Button } from 'antd'

/**
 * 带权限的按钮的组件
 * @constructor
 * @example
 * <AuthButton auth="create">创建</AuthButton>
 */
export default function AuthButton(props: any) {
  const { buttons } = useAuthLoaderData()
  const { userInfo } = useZustandStore()
  const isSuperAdmin = userInfo?.role === 1 // 超级管理员
  const hasPermission = buttons.includes(props.auth) // 根据用户角色判断是否有权限
  const noPermission = !hasPermission
  if (noPermission) {
    return <Button {...props}>{props.children}</Button>
  }
  if (isSuperAdmin || hasPermission) {
    return <Button {...props}>{props.children}</Button>
  }
  return <></>
}
