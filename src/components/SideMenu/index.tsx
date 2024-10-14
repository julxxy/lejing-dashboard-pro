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
import { URIs } from '@/router'
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
const staticSideMenuItems: MenuItem[] = [
  { key: '0', label: '工作台', icon: <DesktopOutlined /> },
  {
    key: '1',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: '102', label: '菜单管理', icon: <MenuOutlined /> },
      { key: '104', label: '部门管理', icon: <ApartmentOutlined /> },
      { key: '101', label: '用户管理', icon: <UserOutlined /> },
      { key: '103', label: '角色管理', icon: <TrademarkCircleOutlined /> },
    ],
  },
  {
    label: '订单管理',
    key: '2',
    icon: <ShoppingCartOutlined />,
    children: [
      { key: '201', label: '订单列表', icon: <OrderedListOutlined /> },
      { key: '202', label: '订单聚合', icon: <GiftOutlined /> },
      { key: '203', label: '货运人员', icon: <TruckOutlined /> },
    ],
  },
]
if (isDebugEnable) log.debug('静态导航栏:', staticSideMenuItems)

/**
 * 生成菜单项
 */
function getAntMenuItem(label: React.ReactNode, key?: React.Key | null, icon?: React.ReactNode, children?: MenuItem[]) {
  return {
    label,
    key,
    icon,
    children,
  } as MenuItem
}

/**
 * 生成菜单树
 */
function getMenuTreeifyItems(sourceMenus: IMenu.Item[], targetMenus: MenuItem[] = []) {
  sourceMenus.forEach(({ menuType, menuState, buttons, menuName, path, children, icon }, index) => {
    if (menuType === MenuType.menu.code && menuState === 1) {
      // 菜单项
      if (!children?.length || buttons) {
        return targetMenus.push(getAntMenuItem(menuName, path || index, <DynamicAntIcon iconName={icon} />))
      }
      // 子菜单项
      targetMenus.push(
        getAntMenuItem(menuName, path || index, <DynamicAntIcon iconName={icon} />, getMenuTreeifyItems(children))
      )
    }
  })
  return targetMenus
}

/**
 * Left Side Menu
 * @constructor
 */
const LeftSideMenu: React.FC<SideMenuProps> = () => {
  const routeData = useAuthLoaderData()
  if (isDebugEnable) log.info('加载路由权限数据: ', routeData)

  const { isDarkEnable, collapsed } = useZustandStore()
  const theme = isDarkEnable ? 'dark' : 'light'
  const platformText = import.meta.env.VITE_OPS_PLATFORM as string
  const platformTextStyle = `${collapsed ? styles.logoTextHidden : styles.logoTextVisible} ${isDarkEnable ? '' : 'logo-text-dark-blue'}`

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  // 菜单展开 & 折叠时保存状态
  const handleOpenChange: MenuProps['onOpenChange'] = keys => {
    setOpenKeys(keys)
    storageUtils.set('menuOpenKeys', keys)
  }

  // 菜单项选中时保存状态
  const handleClick: MenuProps['onClick'] = e => {
    if (isDebugEnable) log.debug('菜单项导航:', e)
    const key = e.key as string
    setSelectedKeys([key])
    storageUtils.set('menuSelectedKeys', [key])
    if (!Environment.isStaticSideMenuEnable()) {
      navigate(key)
    }
  }

  // 组件挂载时: 获取菜单数据
  useEffect(() => {
    if (Environment.isStaticSideMenuEnable()) {
      if (isDebugEnable) log.warn('使用静态导航栏：', staticSideMenuItems)
      setMenuItems(staticSideMenuItems)
    } else {
      const targetMenu = getMenuTreeifyItems(routeData.menus)
      if (isDebugEnable) log.warn('使用动态菜单项数据: ', targetMenu)
      setMenuItems(targetMenu)
    }
  }, [])

  // 组件挂载时: 恢复菜单状态
  useEffect(() => {
    setSelectedKeys(storageUtils.get<string[]>('menuSelectedKeys') ?? [pathname])
    setOpenKeys(storageUtils.get<string[]>('menuOpenKeys') ?? [])
  }, [])

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
          onClick={handleClick}
          onOpenChange={handleOpenChange}
        />
      </div>
    </Sider>
  )
}

export default LeftSideMenu
