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
import { SideMenuProps } from '@/types/apiTypes.ts'
import { useNavigate } from 'react-router-dom'
import { URIs } from '@/router'
import useZustandStore from '@/store/useZustandStore.ts'
import Sider from 'antd/es/layout/Sider'
import { NavigateFunction } from 'react-router/dist/lib/hooks'
import log from '@/common/loggerProvider.ts'
import { isDebugEnable } from '@/common/debugProvider.ts'

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
  switch (key) {
    case '0':
      return navigate(URIs.dashboard) // 跳转到工作台
    case '101':
      return navigate(URIs.userList) // 跳转到用户管理
    case '102':
      return navigate(URIs.menuManage) // 跳转到菜单管理
    case '103':
      return navigate(URIs.roleManage) // 跳转到角色管理
    case '104':
      return navigate(URIs.deptManage) // 跳转到部门管理
    case '201':
      return navigate(URIs.orderList) // 跳转到订单列表
    case '202':
      return navigate(URIs.orderAggregation) // 跳转到订单聚合
    case '203':
      return navigate(URIs.shipperManage) // 跳转到货运人员
    default:
      break
  }
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
