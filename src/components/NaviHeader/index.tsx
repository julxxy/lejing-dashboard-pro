import { DownOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Dropdown, MenuProps, Switch } from 'antd'
import styles from './idnex.module.less'
import { isDebugEnable } from '@/common/debugEnable.ts'
import { log } from '@/common/logger.ts'
import { message } from '@/utils/AntdHelper.ts'

const NaviHeader = () => {
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
      <div className={styles.navHeader}>
        <div className={styles.left}>
          <MenuFoldOutlined />
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
