import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Dropdown, MenuProps, Switch } from 'antd'
import styles from '@/components/NaviHeader/idnex.module.less'
import { isDebugEnable } from '@/common/debugEnable.ts'
import { log } from '@/common/logger.ts'
import { message } from '@/utils/AntdHelper.ts'
import storageUtils from '@/utils/storageUtils.ts'
import { URIs } from '@/router'
import useZustandStore from '@/store/useZustandStore.ts'

const NaviHeader = () => {
  const { userInfo, collapsed, setCollapsed } = useZustandStore()
  const toggleCollapsed = () => setCollapsed() // 控制侧边栏收缩
  const breadItems = [{ title: '首页' }, { title: '工作台' }]
  const items: MenuProps['items'] = [
    {
      label: `邮箱：${userInfo?.userEmail}`,
      key: '1'
    },
    {
      label: '安全退出',
      key: '2'
    }
  ]

  function logout() {
    if (isDebugEnable) log.debug('logout')
    storageUtils.remove('token')
    message.success('退出成功').then(() => {})
    setTimeout(() => {
      location.href = `${URIs.login}?callback=${encodeURIComponent(location.href)}`
    }, 1500)
  }
  const handleMenuClick: MenuProps['onClick'] = e => {
    if (isDebugEnable) log.debug(e)
    const { key } = e
    switch (key) {
      case '1':
        break
      case '2':
        logout()
        break
      default:
        break
    }
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
          <Switch title={'切热主题'} checkedChildren={'暗黑'} unCheckedChildren={'默认'} style={{ marginRight: 10 }} />
          <Dropdown menu={menuProps} trigger={['click']}>
            <Button color={'primary'} variant={'solid'} icon={<UserOutlined />}>
              <span className={styles.nickname}>{userInfo.userName}</span>
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
    </>
  )
}

export default NaviHeader
