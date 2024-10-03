import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Dropdown, MenuProps, Switch } from 'antd'
import styles from '@/components/NaviHeader/idnex.module.less'
import { isDebugEnable } from '@/common/debugEnable.ts'
import { log } from '@/common/logger.ts'
import { message } from '@/utils/AntdHelper.ts'
import { useState } from 'react'

const NaviHeader = () => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
    sessionStorage.setItem('collapsed', `${!collapsed}`)
  }

  const breadItems = [{ title: '首页' }, { title: '工作台' }]
  const items: MenuProps['items'] = [
    {
      label: 'weasley1024@gmail.com',
      key: '1'
    },
    {
      label: '退出',
      key: '2'
    }
  ]
  const handleMenuClick: MenuProps['onClick'] = e => {
    message.info('Click on menu item.')
    if (isDebugEnable) log.debug(e)
  }

  const menuProps = {
    items,
    selectable: true,
    defaultSelectedKeys: ['1'],
    onClick: handleMenuClick
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Button type="text" onClick={toggleCollapsed}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Breadcrumb items={breadItems} style={{ marginLeft: 10 }} />
        </div>
        <div className="right">
          <Switch checkedChildren={'暗黑'} unCheckedChildren={'默认'} style={{ marginRight: 10 }} />
          <Dropdown menu={menuProps} trigger={['click']}>
            <Button icon={<UserOutlined />}>
              <span className={styles.nickname}>Weasley</span>
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
    </>
  )
}

export default NaviHeader
