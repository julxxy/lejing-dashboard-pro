import { Menu } from '@/types'
import React from 'react'
import { MenuType } from '@/types/enum.ts'
import { MenuProps } from 'antd'
import DynamicAntIcon from '@/components/DynamicAntIcon.tsx'

/**
 * Embedded Algorithm for this Application
 */
export const ApplicationAlgorithm = {
  /**
   * Find dynamic breadcrumb items
   * @param treeifyItems Menu tree
   * @param pathname Current pathname
   * @param targetPaths target Breadcrumb targetPaths
   */
  findDynamicBreadcrumbItems(
    treeifyItems: Menu.Item[],
    pathname: string,
    targetPaths: BreadcrumbNodeProps[] = []
  ): BreadcrumbNodeProps[] {
    if (!treeifyItems) return []

    for (const { menuName, path, children } of treeifyItems) {
      const currentPath = [...targetPaths, { title: menuName, href: path ?? '' }]

      if (path === pathname) {
        return currentPath
      }

      if (children) {
        const foundPaths = this.findDynamicBreadcrumbItems(children, pathname, currentPath)
        if (foundPaths.length) {
          return foundPaths
        }
      }
    }

    return []
  },

  /**
   * 获取菜单的 URI 树形列表
   */
  findMenuURIs(source: Menu.Item[]): string[] {
    return source
      .flatMap(({ path, children, buttons }) =>
        Array.isArray(children) && !buttons ? this.findMenuURIs(children) : (path ?? '')
      )
      .filter(Boolean) // 过滤掉空字符串 ''
  },

  /**
   * 生成菜单树型结构
   */
  findTreeifyMenuItems(sourceMenus: Menu.Item[], targetMenus: MenuItem[] = []) {
    // 生成动态图标
    sourceMenus.forEach(({ menuType, menuState, buttons, menuName, path, children, icon }, index) => {
      if (menuType === MenuType.menu.code && menuState === 1) {
        // 菜单项
        if (!children?.length || buttons) {
          targetMenus.push(getAntMenuItem(menuName, path || index, <DynamicAntIcon iconName={icon} />))
        } else {
          // 子菜单项
          targetMenus.push(
            getAntMenuItem(
              menuName,
              path || index,
              <DynamicAntIcon iconName={icon} />,
              this.findTreeifyMenuItems(children)
            )
          )
        }
      }
    })
    return targetMenus
  },

  /**
   * 用于搜索路径的通用递归函数
   * @description 递归搜索路由树，返回匹配的路由对象
   * @param routes - 路由数组（T 类型）
   * @param targetRoute - 要搜索的路由路径
   * @returns 找到的 T 类型或 undefined
   */
  findRoute<T extends { path?: string; children?: T[] }>(routes: T[], targetRoute: string): T | undefined {
    for (const route of routes) {
      // 直接匹配
      if (route.path === targetRoute) return route
      // 如果有孩子，则递归搜索
      if (route.children) {
        const foundChild = this.findRoute(route.children, targetRoute)
        if (foundChild) return foundChild
      }
    }
    return undefined
  },
}

// Breadcrumb Node Props
export interface BreadcrumbNodeProps {
  title: string | React.ReactNode
  href?: string
}

// 侧边栏菜单项
export type MenuItem = Required<MenuProps>['items'][number]

// 生成菜单项
function getAntMenuItem(label: React.ReactNode, key?: React.Key | null, icon?: React.ReactNode, children?: MenuItem[]) {
  return {
    label,
    key,
    icon,
    children,
  } as MenuItem
}
