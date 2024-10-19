import {
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileFilled,
  UserOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, MenuProps, Switch, Tooltip } from 'antd'
import styles from '@/components/NaviHeader/idnex.module.less'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { message } from '@/context/AntdGlobalProvider.ts'
import storageUtils from '@/utils/storageUtils.ts'
import { URIs } from '@/router'
import useZustandStore from '@/store/useZustandStore.ts'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BreadcrumbFC from '@/components/NaviHeader/BreadcrumbFC.tsx'
import { themeSwitch } from '@/components/ThemeSwitch.tsx'

const NaviHeader = () => {
  const { userInfo, collapsed, isDarkEnable, setCollapsed, setToken, setIsDarkEnable } = useZustandStore()
  const toggleCollapsed = () => setCollapsed()
  const navigate = useNavigate()
  const items: MenuProps['items'] = [
    { key: '1', label: '个人中心', icon: <ProfileFilled /> },
    { key: '2', label: '切换账号', icon: <UserSwitchOutlined /> },
    { key: '3', label: '安全退出', icon: <LoginOutlined /> },
  ]
  const handleMenuClick: MenuProps['onClick'] = e => {
    if (isDebugEnable) log.debug(e)
    const { key } = e
    if (key === '1') {
      return navigate(URIs.dashboard)
    } else if (key === '2') {
      return switchAccount()
    } else if (key === '3') {
      return logout()
    }
    return undefined
  }

  const menuProps = {
    items,
    selectable: true,
    defaultSelectedKeys: ['0'],
    onClick: handleMenuClick,
  }

  function logout() {
    storageUtils.clear()
    message.success('退出成功')
    setTimeout(() => {
      location.href = `${URIs.login}?callback=${encodeURIComponent(location.href)}`
    }, 1500)
  }

  function switchAccount() {
    setToken('')
    storageUtils.remove('token')
    location.href = `${URIs.login}?callback=${encodeURIComponent(location.href)}`
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkEnable ? 'dark' : 'light')
  }, [isDarkEnable])

  const toggleTheme = () => {
    setIsDarkEnable()
  }

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <Button type="text" size="large" onClick={toggleCollapsed}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <BreadcrumbFC />
      </div>
      <div className={styles.right}>
        <Switch
          className={styles.switch}
          checkedChildren={themeSwitch.sun}
          unCheckedChildren={themeSwitch.moon}
          checked={!isDarkEnable}
          onChange={toggleTheme}
          style={{ backgroundColor: isDarkEnable ? '' : '#edf2f7' }}
        />
        <Dropdown.Button
          menu={menuProps}
          size="middle"
          icon={<UserOutlined />}
          style={{ borderRadius: 'var(--border-radius-default)' }}
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
