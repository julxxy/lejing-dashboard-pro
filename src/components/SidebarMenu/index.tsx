import styles from '@/components/SidebarMenu/index.module.less'
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
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { moduleURIs, URIs } from '@/router'
import useZustandStore from '@/store/useZustandStore.ts'
import Sider from 'antd/es/layout/Sider'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { Environment } from '@/types/appEnum.ts'
import useAuthLoaderData from '@/hooks/useAuthLoader.ts'
import storageUtils from '@/utils/storageUtils.ts'
import { ApplicationAlgorithm, MenuItem } from '@/context/ApplicationAlgorithm.tsx'

/**
 * Left Sidebar Menu
 */
const SidebarMenu: React.FC = () => {
  const routeData = useAuthLoaderData()
  const { isDarkEnable, collapsed } = useZustandStore()
  const theme = isDarkEnable ? 'dark' : 'light'
  const platformText = import.meta.env.VITE_OPS_PLATFORM as string
  const platformTextStyle = `${collapsed ? styles.logoTextHidden : styles.logoTextVisible} ${
    isDarkEnable ? '' : 'logo-text-dark-blue'
  }`
  const { setActiveTab } = useZustandStore()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // 组件挂载时: 获取菜单数据/恢复菜单状态
  useEffect(() => {
    // 如果 URIs 尚未初始化，等待
    if (!URIs || !moduleURIs) return
    if (Environment.isStaticMenuEnable()) {
      // 静态导航栏
      setMenuItems([
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
            { key: URIs.order.aggregation, label: '订单智汇', icon: <GiftOutlined /> },
            { key: URIs.order.shipper, label: '货运人员', icon: <TruckOutlined /> },
          ],
        },
      ])
      if (isDebugEnable) log.info('使用静态菜单数据：', menuItems)
    } else {
      const dynamicMenuItems = ApplicationAlgorithm.findTreeifyMenuItems(routeData.menus)
      if (isDebugEnable) log.info('使用动态菜单数据: ', dynamicMenuItems)
      setMenuItems(dynamicMenuItems)
    }

    // 恢复菜单展开和选中状态
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
    if (isDebugEnable) log.info('菜单项导航:', key)
    storageUtils.set('menuSelectedKeys', [key])
    setSelectedKeys([key])
    setActiveTab(key)
    return navigate(key)
  }

  return (
    <Sider className={styles.sider} trigger={null} collapsible collapsed={collapsed} collapsedWidth={58} theme={theme}>
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

export default SidebarMenu
