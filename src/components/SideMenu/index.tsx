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
import { Menu as IMenu, SideMenuProps } from '@/types/apiTypes.ts'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom'
import { URIs } from '@/router'
import useZustandStore from '@/store/useZustandStore.ts'
import Sider from 'antd/es/layout/Sider'
import { NavigateFunction } from 'react-router/dist/lib/hooks'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { RouteConstants } from '@/router/DefaultAuthLoader.ts'
import { MenuType } from '@/types/appEnums.ts'
import DynamicAntIcon from '@/components/DynamicAntIcon.tsx'

// 侧边栏菜单项
type MenuItem = Required<MenuProps>['items'][number]

// 静态导航栏
const antdItems: MenuItem[] = [
  { key: '0', icon: <DesktopOutlined />, label: '工作台' },
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
if (isDebugEnable) log.debug('静态导航栏:', antdItems)

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
 * 点击菜单项时执行导航
 */
function handleMenuClick(menuInfo: MenuItem, navigate: NavigateFunction): MenuProps['onClick'] | void {
  const key = menuInfo?.key as string
  if (isDebugEnable) log.debug('菜单项导航:', menuInfo)
  navigate(key)
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
  const routeData: any = useRouteLoaderData(RouteConstants.layoutId)
  if (isDebugEnable) log.info('加载路由权限数据: ', routeData)

  const { isDarkEnable, collapsed } = useZustandStore()
  const theme = isDarkEnable ? 'dark' : 'light'
  const platformText = import.meta.env.VITE_OPS_PLATFORM as string
  const platformTextStyle = `${collapsed ? styles.logoTextHidden : styles.logoTextVisible} ${isDarkEnable ? '' : 'logo-text-dark-blue'}`
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [targetMenus, setTargetMenus] = useState<MenuItem[]>([])
  const getDefaultSelectedKeys = () => [URIs.welcome]
  const getDefaultOpenKeys = () => [pathname]

  useEffect(() => {
    const targetMenu = getMenuTreeifyItems(routeData.menus)
    log.info('初始化菜单项数据: ', targetMenu)
    setTargetMenus(targetMenu)
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
          items={targetMenus}
          defaultOpenKeys={getDefaultOpenKeys()}
          defaultSelectedKeys={getDefaultSelectedKeys()}
          onClick={e => handleMenuClick(e, navigate)}
        />
      </div>
    </Sider>
  )
}

export default LeftSideMenu
