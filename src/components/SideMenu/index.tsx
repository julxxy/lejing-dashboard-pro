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
  UserSwitchOutlined
} from '@ant-design/icons'
import { Menu, MenuProps } from 'antd'
import React from 'react'
import { SideMenuProps } from '@/types/apiTypes.ts'
import { useNavigate } from 'react-router-dom'

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
      { key: '104', label: '部门管理', icon: <BarsOutlined /> }
    ]
  },
  {
    key: '2',
    icon: <ProductOutlined />,
    label: '订单管理',
    children: [
      { key: '201', label: '订单列表', icon: <OrderedListOutlined /> },
      { key: '202', label: '订单聚合', icon: <GiftOutlined /> },
      { key: '203', label: '货运人员', icon: <TruckOutlined /> }
    ]
  }
]

const LeftSideMenu: React.FC<SideMenuProps> = ({ collapsed }) => {
  const navigate = useNavigate()
  return (
    <>
      <div className={styles.menu}>
        <div className={styles.logo} onClick={() => navigate('/welcome')}>
          <img src={'/images/ops-logo.jpeg'} alt={'ops-logo'} className={styles.logoImg} />
          <span>乐璟 OPS</span>
        </div>
        <Menu defaultSelectedKeys={['0']} mode={'inline'} theme={'dark'} inlineCollapsed={collapsed} items={items} />
      </div>
    </>
  )
}

export default LeftSideMenu
