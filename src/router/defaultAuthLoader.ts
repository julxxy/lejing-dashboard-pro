import api from '@/api'
import { Menu } from '@/types'
import { ApplicationAlgorithm } from '@/context/ApplicationAlgorithm.tsx'

/**
 * 路由元信息
 */
export interface IRouteMeta {
  // 路由 ID
  routeId: string
  // 路由按钮列表
  buttons: string[]
  // 菜单列表
  menus: Menu.Item[]
  // 菜单 URI 列表
  menuURIs: string[]
}

/**
 * 路由权限加载器: 页面渲染前加载路由权限信息
 */
export async function defaultAuthLoader(): Promise<IRouteMeta> {
  const { buttonList, menuList } = await api.user.getPermissions()
  const menuURIs = ApplicationAlgorithm.findMenuURIs(menuList)
  return {
    routeId: RouteConstants.layoutId,
    buttons: buttonList,
    menus: menuList,
    menuURIs,
  }
}

/**
 * 路由常量
 */
export const RouteConstants = {
  layoutId: 'layout',
}
