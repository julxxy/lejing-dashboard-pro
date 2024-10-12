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
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { URIs } from '@/router'
import useZustandStore from '@/store/useZustandStore.ts'
import Sider from 'antd/es/layout/Sider'
import { NavigateFunction } from 'react-router/dist/lib/hooks'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { SideMenuProps } from '@/types/apiTypes.ts'

// 菜单项
type MenuItem = Required<MenuProps>['items'][number]
const items: MenuItem[] = [
  { key: '0', icon: <DesktopOutlined />, label: '工作台' },
  {
    key: '1',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: '101', label: '用户管理', icon: <UserOutlined /> },
      { key: '102', label: '菜单管理', icon: <MenuOutlined /> },
      { key: '103', label: '角色管理', icon: <TrademarkCircleOutlined /> },
      { key: '104', label: '部门管理', icon: <ApartmentOutlined /> },
    ],
  },
  {
    key: '2',
    icon: <ShoppingCartOutlined />,
    label: '订单管理',
    children: [
      { key: '201', label: '订单列表', icon: <OrderedListOutlined /> },
      { key: '202', label: '订单聚合', icon: <GiftOutlined /> },
      { key: '203', label: '货运人员', icon: <TruckOutlined /> },
    ],
  },
]

/**
 * 点击菜单项时执行导航
 */
function onMenuClicked(menuInfo: MenuItem, navigate: NavigateFunction): MenuProps['onClick'] | void {
  const key = menuInfo?.key as string | undefined
  if (isDebugEnable) log.debug('菜单项导航:', menuInfo)
  if (key === '0') navigate(URIs.dashboard)
  if (key === '101') navigate(URIs.system.userList)
  if (key === '102') navigate(URIs.system.menuList)
  if (key === '103') navigate(URIs.system.roleList)
  if (key === '104') navigate(URIs.system.deptList)
  if (key === '201') navigate(URIs.order.orderList)
  if (key === '202') navigate(URIs.order.orderAggregation)
  if (key === '203') navigate(URIs.order.shipperList)
}

const LeftSideMenu: React.FC<SideMenuProps> = () => {
  const { isDarkEnable, collapsed } = useZustandStore()
  const theme = isDarkEnable ? 'dark' : 'light'
  const platformText = import.meta.env.VITE_OPS_PLATFORM as string
  const platformTextStyle = `${collapsed ? styles.logoTextHidden : styles.logoTextVisible} ${isDarkEnable ? '' : 'logo-text-dark-blue'}`
  const navigate = useNavigate()
  const location = useLocation()

  const getDefaultOpenKeys = () => {
    if (location.pathname.startsWith(URIs.dashboard)) return ['0']
    if (location.pathname.startsWith(URIs.module.system)) return ['1']
    if (location.pathname.startsWith(URIs.module.order)) return ['2']
    return [] // Default empty if no match
  }

  const getDefaultSelectedKeys = () => {
    if (location.pathname.startsWith(URIs.dashboard)) return ['0']
    if (location.pathname === URIs.system.userList) return ['101']
    if (location.pathname === URIs.system.menuList) return ['102']
    if (location.pathname === URIs.system.roleList) return ['103']
    if (location.pathname === URIs.system.deptList) return ['104']
    if (location.pathname === URIs.order.orderList) return ['201']
    if (location.pathname === URIs.order.orderAggregation) return ['202']
    if (location.pathname === URIs.order.shipperList) return ['203']
    return [] // Default empty if no match
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
          items={items}
          defaultOpenKeys={getDefaultOpenKeys()}
          defaultSelectedKeys={getDefaultSelectedKeys()}
          onClick={e => onMenuClicked(e, navigate)}
        />
      </div>
    </Sider>
  )
}

export default LeftSideMenu
