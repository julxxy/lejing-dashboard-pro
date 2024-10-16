import styles from '@/components/SideMenu/index.module.less'
import {
  ApartmentOutlined,
  DesktopOutlined,
  GiftOutlined,
  MenuOutlined,
  OrderedListOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TrademarkCircleOutlined,
  TruckOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Menu, MenuProps, Tooltip } from 'antd'
import { Menu as IMenu, SideMenuProps } from '@/types/apiType.ts'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { moduleURIs, URIs } from '@/router'
import useZustandStore from '@/store/useZustandStore.ts'
import Sider from 'antd/es/layout/Sider'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { Environment, MenuType } from '@/types/appEnum.ts'
import DynamicAntIcon from '@/components/DynamicAntIcon.tsx'
import useAuthLoaderData from '@/hooks/useAuthLoader.ts'
import storageUtils from '@/utils/storageUtils.ts'

// 侧边栏菜单项
type MenuItem = Required<MenuProps>['items'][number]
// 静态导航栏
let staticMenuItems: MenuItem[] = []
setTimeout(() => {
  staticMenuItems = [
    { key: URIs.dashboard, label: '工作台', icon: <DesktopOutlined /> },
    {
      key: moduleURIs.system,
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        { key: URIs.system.menu, label: '菜单管理', icon: <MenuOutlined /> },
        { key: URIs.system.dept, label: '部门管理', icon: <ApartmentOutlined /> },
        { key: URIs.system.user, label: '用户管理', icon: <UserOutlined /> },
        { key: URIs.system.role, label: '角色管理', icon: <TrademarkCircleOutlined /> },
      ],
    },
    {
      label: '订单管理',
      key: moduleURIs.order,
      icon: <ShoppingCartOutlined />,
      children: [
        { key: URIs.order.list, label: '订单列表', icon: <OrderedListOutlined /> },
        { key: URIs.order.aggregation, label: '订单聚合', icon: <GiftOutlined /> },
        { key: URIs.order.shipper, label: '货运人员', icon: <TruckOutlined /> },
      ],
    },
  ]
  if (isDebugEnable && Environment.isStaticMenuEnable()) log.debug('静态导航栏:', staticMenuItems)
}, 100) // 延迟加载: 防止 URIs 未初始化完报错

// 生成菜单项
function getAntMenuItem(label: React.ReactNode, key?: React.Key | null, icon?: React.ReactNode, children?: MenuItem[]) {
  return {
    label,
    key,
    icon,
    children,
  } as MenuItem
}

// 生成菜单树
function getMenuTreeifyItems(sourceMenus: IMenu.Item[], targetMenus: MenuItem[] = []) {
  sourceMenus.forEach(({ menuType, menuState, buttons, menuName, path, children, icon }, index) => {
    if (menuType === MenuType.menu.code && menuState === 1) {
      // 菜单项
      if (!children?.length || buttons) {
        targetMenus.push(getAntMenuItem(menuName, path || index, <DynamicAntIcon iconName={icon} />))
      } else {
        // 子菜单项
        targetMenus.push(
          getAntMenuItem(menuName, path || index, <DynamicAntIcon iconName={icon} />, getMenuTreeifyItems(children))
        )
      }
    }
  })
  return targetMenus
}

/**
 * Left Side Menu
 */
const LeftSideMenu: React.FC<SideMenuProps> = () => {
  const routeData = useAuthLoaderData()
  if (isDebugEnable) log.info('加载路由权限数据: ', routeData)

  const { isDarkEnable, collapsed } = useZustandStore()
  const theme = isDarkEnable ? 'dark' : 'light'
  const platformText = import.meta.env.VITE_OPS_PLATFORM as string
  const platformTextStyle = `${collapsed ? styles.logoTextHidden : styles.logoTextVisible} ${isDarkEnable ? '' : 'logo-text-dark-blue'}`
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])

  const { pathname } = useLocation()
  const navigate = useNavigate()

  // 组件挂载时: 获取菜单数据/恢复菜单状态
  useEffect(() => {
    if (Environment.isStaticMenuEnable()) {
      if (isDebugEnable) log.warn('静态菜导航栏单数据：', JSON.stringify(staticMenuItems, null, 2))
      setMenuItems(staticMenuItems)
    } else {
      const dynamicMenuItems = getMenuTreeifyItems(routeData.menus)
      if (isDebugEnable) log.warn('动态菜导航栏单数据: ', JSON.stringify(dynamicMenuItems, null, 2))
      setMenuItems(dynamicMenuItems)
    }
    setOpenKeys(storageUtils.get<string[]>('menuOpenKeys') ?? [])
    setSelectedKeys([pathname])
  }, [routeData.menus, pathname])

  // 菜单展开 & 折叠时保存状态
  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    setOpenKeys(keys)
    storageUtils.set('menuOpenKeys', keys)
  }

  // 菜单项选中时保存状态
  const onMenuClick: MenuProps['onClick'] = ({ key }: { key: string }) => {
    if (isDebugEnable) log.info('菜单项导航:', key, 'Pathname:', pathname)
    storageUtils.set('menuSelectedKeys', [key])
    setSelectedKeys([key])
    return navigate(key)
  }

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={58} className={styles.sider} theme={theme}>
      <div className={styles.menu}>
        <div className={styles.logo} onClick={() => navigate(URIs.welcome)}>
          <Tooltip
            title={platformText}
            color="volcano"
            mouseLeaveDelay={0.3}
            trigger={collapsed ? 'hover' : 'contextMenu'}
            placement="rightTop"
          >
            <img
              src="/images/operations-icon.png"
              alt={'ops-logo'}
              className={`${styles.logoImg}`}
              style={{ marginLeft: collapsed ? 16 : 28 }}
            />
          </Tooltip>
          <span className={platformTextStyle}>{platformText}</span>
        </div>
        <Menu
          mode={'inline'}
          theme={theme}
          items={menuItems}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onClick={onMenuClick}
          onOpenChange={onOpenChange}
        />
      </div>
    </Sider>
  )
}

export default LeftSideMenu
