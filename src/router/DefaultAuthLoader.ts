import api from '@/api'
import { Menu } from '@/types/apiTypes.ts'
import { useRouteLoaderData } from 'react-router-dom'

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
export async function DefaultAuthLoader(): Promise<IRouteMeta> {
  const { buttonList, menuList } = await api.user.getPermissions()
  const menuURIs = getMenuURIs(menuList)
  return {
    routeId: RouteConstants.layoutId,
    buttons: buttonList,
    menus: menuList,
    menuURIs,
  }
}

/**
 * 获取路由权限信息
 */
export function useAuthLoaderData(): IRouteMeta {
  return useRouteLoaderData(RouteConstants.layoutId) as IRouteMeta
}

/**
 * 路由常量
 */
export const RouteConstants = {
  layoutId: 'layout',
}

/**
 * 获取菜单的 URI 树形列表
 */
export function getMenuURIs(target: Menu.Item[]): string[] {
  return target
    .flatMap(({ path, children, buttons }) =>
      Array.isArray(children) && !buttons ? getMenuURIs(children) : (path ?? '')
    )
    .filter(Boolean) // 过滤掉空字符串 ''
}
