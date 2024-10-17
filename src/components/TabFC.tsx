import { useLocation, useNavigate } from 'react-router-dom'
import React, { CSSProperties, useEffect, useState } from 'react'
import { Tabs } from 'antd'
import useAuthLoaderData from '@/hooks/useAuthLoader.ts'
import { ApplicationAlgorithm } from '@/context/ApplicationAlgorithm.tsx'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { Menu, TabItem } from '@/types/apiType.ts'
import { URIs } from '@/router'
import { CloseCircleOutlined } from '@ant-design/icons'
import useZustandStore from '@/store/useZustandStore.ts'
import storageUtils from '@/utils/storageUtils.ts'

type TargetKey = React.MouseEvent | React.KeyboardEvent | string

const CSS = {
  tabBarWrapper: (): CSSProperties => ({
    display: 'flex',
    borderRadius: '0 0 8px 8px',
    margin: '0 14px 0 14px',
    borderTop: '1px solid #e8e8e8',
    height: 40,
  }),
}

/**
 * 顶部页签项
 */
const TabFC = () => {
  const { activeTab, setActiveTab } = useZustandStore()
  const navigate = useNavigate()
  const [showTab, setShowTab] = useState(false)
  const { pathname } = useLocation()
  const { menus } = useAuthLoaderData()
  const [tabItems, setTabItems] = useState<TabItem[]>([{ label: '首页', key: URIs.welcome, closable: false }])

  const createTabs = () => {
    const route = ApplicationAlgorithm.findRoute<Menu.Item>(menus, pathname)
    if (!route) return

    setShowTab(true)
    const isTabExist = tabItems.some(item => item.key === route.path)

    if (!isTabExist) {
      setTabItems(prevTabs => [
        ...prevTabs,
        {
          label: route.menuName,
          key: route.path || '',
          closable: pathname !== URIs.welcome,
        },
      ])
      const prevActive = storageUtils.get<string>('activeTab')
      if (prevActive) {
        setActiveTab(prevActive)
      } else {
        setActiveTab(route.path || '')
      }
    }
  }

  useEffect(() => {
    createTabs()
    if (isDebugEnable) log.info('Creating Tabs: ', tabItems)
  }, [pathname])

  const onChangeTab = (newActiveKey: string) => {
    setActiveTab(newActiveKey)
    navigate(newActiveKey)
  }

  const remove = (targetKey: TargetKey) => {
    if (pathname === targetKey) {
      tabItems.forEach(({ key }, index) => {
        if (key !== pathname) return
        const nextTab = tabItems[index + 1] || tabItems[index - 1]
        if (!nextTab) return
        setActiveTab(nextTab.key)
        navigate(nextTab.key)
      })
    }
    setTabItems(prevTabs => prevTabs.filter(item => item.key !== targetKey))
    if (isDebugEnable) log.info('Removed Tab: ', targetKey, tabItems)
  }

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'remove') {
      remove(targetKey)
    }
  }

  if (!showTab) return null

  return (
    <Tabs
      type="editable-card"
      removeIcon={<CloseCircleOutlined />}
      tabBarStyle={{ ...CSS.tabBarWrapper(), backgroundColor: '#fff' }}
      activeKey={activeTab}
      onChange={onChangeTab}
      onEdit={onEdit}
      hideAdd={true}
      items={tabItems}
    />
  )
}

export default React.memo(TabFC)
