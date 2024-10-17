import { Menu } from '@/types/apiType.ts'
import React from 'react'
import { MenuType } from '@/types/appEnum.ts'
import { MenuProps } from 'antd'
import DynamicAntIcon from '@/components/DynamicAntIcon.tsx'

/**
 * Embedded Algorithm for this Application
 */
export const ApplicationAlgorithm = {
  /**
   * Find dynamic breadcrumb items
   * @param tree Menu tree
   * @param pathname Current pathname
   * @param targetPaths target Breadcrumb targetPaths
   */
  findDynamicBreadcrumbItems(
    tree: Menu.Item[],
    pathname: string,
    targetPaths: BreadcrumbNodeProps[] = []
  ): BreadcrumbNodeProps[] {
    if (!tree) return []

    for (const { menuName, path, children } of tree) {
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
  findMenuURIs(target: Menu.Item[]): string[] {
    return target
      .flatMap(({ path, children, buttons }) =>
        Array.isArray(children) && !buttons ? this.findMenuURIs(children) : (path ?? '')
      )
      .filter(Boolean) // 过滤掉空字符串 ''
  },

  /**
   * 生成菜单树型结构
   */
  getTreeifyMenuItems(sourceMenus: Menu.Item[], targetMenus: MenuItem[] = []) {
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
              this.getTreeifyMenuItems(children)
            )
          )
        }
      }
    })
    return targetMenus
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
