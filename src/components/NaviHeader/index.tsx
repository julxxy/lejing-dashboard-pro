import {
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileFilled,
  UserOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Button, Dropdown, MenuProps, Switch, Tooltip } from 'antd'
import styles from '@/components/NaviHeader/idnex.module.less'
import { debugEnable, log } from '@/common/loggerProvider.ts'
import { message } from '@/context/AntdGlobalProvider.ts'
import storageUtils from '@/utils/storageUtils.ts'
import { URIs } from '@/router'
import useZustandStore from '@/store/useZustandStore.ts'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isTrue } from '@/common/booleanUtils.ts'

const NaviHeader = () => {
  const { userInfo, collapsed, isDarkEnable, setCollapsed, setToken, setDarkEnable } = useZustandStore()
  const toggleCollapsed = () => setCollapsed()
  const navigate = useNavigate()
  const breadItems = [{ title: '首页' }, { title: '工作台' }]
  const items: MenuProps['items'] = [
    { key: '1', label: '个人中心', icon: <ProfileFilled /> },
    { key: '2', label: '切换账号', icon: <UserSwitchOutlined /> },
    { key: '3', label: '安全退出', icon: <LoginOutlined /> },
  ]
  const handleMenuClick: MenuProps['onClick'] = e => {
    if (debugEnable) log.debug(e)
    const { key } = e
    switch (key) {
      case '1':
        return navigate(URIs.dashboard)
      case '2':
        return switchAccount()
      case '3':
        return logout()
      default:
        break
    }
  }

  const menuProps = {
    items,
    selectable: true,
    defaultSelectedKeys: ['0'],
    onClick: handleMenuClick,
  }

  function logout() {
    storageUtils.remove('token')
    message.success('退出成功')
    setTimeout(() => {
      location.href = `${URIs.login}?callback=${encodeURIComponent(location.href)}`
    }, 1500)
  }

  function switchAccount() {
    setToken('')
    storageUtils.clear()
    location.href = `${URIs.login}?callback=${encodeURIComponent(location.href)}`
  }

  useEffect(() => {
    if (isTrue(storageUtils.get('darkEnable'))) setDarkEnable()
  }, [])

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <Button type={'text'} size={'large'} onClick={toggleCollapsed}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Breadcrumb items={breadItems} style={{ marginLeft: 10 }} />
      </div>
      <div className={styles.right}>
        <Switch
          className={`${styles.switch} ${isDarkEnable ? styles.switchDarkColor : styles.switchBrightColor}`}
          checkedChildren={'明亮'}
          unCheckedChildren={'暗黑'}
          checked={!isDarkEnable}
          onClick={() => setDarkEnable()}
        />
        <Dropdown.Button
          className="btn-secondary"
          menu={menuProps}
          size={'middle'}
          icon={<UserOutlined />}
          placement={'bottomLeft'}
          type={'text'}
          arrow={true}
          buttonsRender={([leftButton, rightButton]) => [
            <Tooltip title={userInfo.job} key="leftButton">
              {leftButton}
            </Tooltip>,
            React.cloneElement(rightButton as React.ReactElement<any, string>, { loading: false }),
          ]}
        >
          <span className={styles.nickname}>{userInfo.userName}</span>
        </Dropdown.Button>
      </div>
    </div>
  )
}

export default NaviHeader
