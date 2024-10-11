import styles from '@/components/SideMenu/index.module.less'
import {
  BarsOutlined,
  DesktopOutlined,
  GiftOutlined,
  MenuOutlined,
  OrderedListOutlined,
  ProductOutlined,
  SettingOutlined,
  TeamOutlined,
  TruckOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons'
import { Menu, MenuProps, Tooltip } from 'antd'
import React from 'react'
import { SideMenuProps } from '@/types/ApiTypes.ts'
import { useNavigate } from 'react-router-dom'
import { URIs } from '@/router'
import useZustandStore from '@/store/useZustandStore.ts'
import Sider from 'antd/es/layout/Sider'
import { NavigateFunction } from 'react-router/dist/lib/hooks'
import { isDebugEnable, log } from '@/common/Logger.ts'

// 菜单项
type MenuItem = Required<MenuProps>['items'][number]
const items: MenuItem[] = [
  { key: '0', icon: <DesktopOutlined />, label: '工作台' },
  {
    key: '1',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: '101', label: '用户管理', icon: <TeamOutlined /> },
      { key: '102', label: '菜单管理', icon: <MenuOutlined /> },
      { key: '103', label: '角色管理', icon: <UserSwitchOutlined /> },
      { key: '104', label: '部门管理', icon: <BarsOutlined /> },
    ],
  },
  {
    key: '2',
    icon: <ProductOutlined />,
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
  if (isDebugEnable) log.debug('菜单项导航:', menuInfo)
  const key = menuInfo?.key as string | undefined
  if (key === '0') navigate(URIs.dashboard)
  if (key === '101') navigate(URIs.userList)
  if (key === '102') navigate(URIs.menuManage)
  if (key === '103') navigate(URIs.roleManage)
  if (key === '104') navigate(URIs.deptManage)
  if (key === '201') navigate(URIs.orderList)
  if (key === '202') navigate(URIs.orderAggregation)
  if (key === '203') navigate(URIs.shipperManage)
}

const LeftSideMenu: React.FC<SideMenuProps> = () => {
  const { isDarkEnable, collapsed } = useZustandStore()
  const theme = isDarkEnable ? 'dark' : 'light'
  const platformText = import.meta.env.VITE_OPS_PLATFORM as string
  const platformTextStyle = `${collapsed ? styles.logoTextHidden : styles.logoTextVisible} ${isDarkEnable ? '' : 'logo-text-dark-blue'}`
  const navigate = useNavigate()

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
          defaultSelectedKeys={['0']}
          onClick={e => onMenuClicked(e, navigate)}
        />
      </div>
    </Sider>
  )
}

export default LeftSideMenu
