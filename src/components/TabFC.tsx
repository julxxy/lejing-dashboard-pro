import { useLocation, useNavigate } from 'react-router-dom'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { Tabs } from 'antd'
import useAuthLoaderData from '@/hooks/useAuthLoader.ts'
import { ApplicationAlgorithm } from '@/context/ApplicationAlgorithm.tsx'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { Menu, TabItem } from '@/types/apiType.ts'
import { URIs } from '@/router'
import { CloseCircleOutlined, PushpinFilled } from '@ant-design/icons'
import useZustandStore from '@/store/useZustandStore.ts'

type TargetKey = React.MouseEvent | React.KeyboardEvent | string

const CSS = {
  tabBarWrapper: (): CSSProperties => ({
    display: 'flex',
    borderRadius: '0 0 8px 8px',
    margin: '0 14px 0 14px',
    borderTop: '1px solid var(--bg-color-primary)',
    height: 40,
    color: 'var(--sidebar-text)',
    backgroundColor: 'var(--bg-color-default)',
  }),
}

/**
 * 顶部页签项
 */
const TabFC = () => {
  const { activeTab, setActiveTab } = useZustandStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { menus } = useAuthLoaderData()

  const [tabItems, setTabItems] = useState<TabItem[]>([
    {
      label: '首页',
      key: URIs.welcome,
      icon: <PushpinFilled />,
      closable: false,
    },
  ])
  const tabItemsRef = useRef(tabItems)

  const createTabs = () => {
    const route = ApplicationAlgorithm.findRoute<Menu.Item>(menus, pathname)
    if (!route) return

    const isTabExist = tabItemsRef.current.some(item => item.key === route.path)

    if (!isTabExist) {
      const closable = pathname !== URIs.welcome
      const newTab = {
        label: route.menuName,
        key: route.path || '',
        closable,
      }
      setTabItems(prevTabs => [...prevTabs, newTab])
    }

    setActiveTab(route.path || '')
  }

  useEffect(() => {
    tabItemsRef.current = tabItems
  }, [tabItems])

  useEffect(() => {
    if (pathname === URIs.welcome) {
      setActiveTab(URIs.welcome)
    } else {
      createTabs()
    }
    if (isDebugEnable) log.info('Creating Tabs: ', tabItems)
  }, [pathname])

  const onChangeTab = (newActiveKey: string) => {
    setActiveTab(newActiveKey)
    navigate(newActiveKey)
  }

  const remove = (targetKey: TargetKey) => {
    if (pathname === targetKey) {
      const tabIndex = tabItemsRef.current.findIndex(item => item.key === targetKey)
      const nextTab = tabItemsRef.current[tabIndex + 1] || tabItemsRef.current[tabIndex - 1]
      if (nextTab) {
        setActiveTab(nextTab.key)
        navigate(nextTab.key)
      }
    }
    setTabItems(prevTabs => prevTabs.filter(item => item.key !== targetKey))
    if (isDebugEnable) log.info('Removed Tab: ', targetKey, tabItems)
  }

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'remove') {
      remove(targetKey)
    }
  }

  if (tabItems.length === 1 && tabItems[0].key === URIs.welcome && pathname !== URIs.welcome) return null

  return (
    <Tabs
      type="editable-card"
      removeIcon={<CloseCircleOutlined />}
      tabBarStyle={{ ...CSS.tabBarWrapper() }}
      activeKey={activeTab}
      onChange={onChangeTab}
      onEdit={onEdit}
      hideAdd={true}
      items={tabItems}
    />
  )
}

export default React.memo(TabFC)
