import { lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Layout, Watermark } from 'antd'
import SidebarMenu from '@/components/SidebarMenu'
import styles from '@/layout/index.module.less'
import api from '@/api'
import useZustandStore from '@/store/useZustandStore.ts'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isTrue } from '@/common/booleanUtils.ts'
import { Environment } from '@/types/enum.ts'
import { isURIAccessible, URIs } from '@/router'
import { isDebugEnable, log } from '@/common/Logger.ts'
import useAuthLoaderData from '@/hooks/useAuthLoader.ts'
import TabFC from '@/components/TabFC.tsx'
import Lazy from '@/components/Lazy.tsx'
import { NavHeader } from '@/components/NavHeader'
import { NavFooter } from '@/components/NavFooter'

// 解构 antd 组件
const { Content } = Layout
// 获取水印配置
const watermark = (): string[] => {
  const showWatermark = isTrue(import.meta.env.VITE_SHOW_WATERMARK)
  return showWatermark ? import.meta.env.VITE_APP_WATERMARKS.split(',') : []
}

/**
 * Layout 组件
 */
export default function LayoutFC() {
  const { userInfo, setUserInfo } = useZustandStore() // 获取 store
  const windowRef = useRef<HTMLDivElement>(null) // 创建引用
  const [contentHeight, setContentHeight] = useState<string>('100vh') // 默认视口高度
  const headerHeight = 64 // 导航栏高度为 64px

  // 获取用户信息（如果不可用）
  const getUserInfo = useCallback(async () => {
    if (!userInfo._id) {
      const fetchedUserInfo = await api.getUserInfo()
      setUserInfo(fetchedUserInfo)
    }
  }, [userInfo, setUserInfo])

  useEffect(() => {
    getUserInfo()
  }, [])

  // 动态计算内容区域的的高度
  useEffect(() => {
    const updateHeight = () => {
      const newHeight = window.innerHeight - headerHeight
      setContentHeight(`${newHeight}px`)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const { pathname } = useLocation()
  const routeMeta = useAuthLoaderData()
  const { menuURIs } = routeMeta
  const isAccessible = isURIAccessible(pathname)

  /* 路由权限校验 */
  if (!Environment.isStaticMenuEnable()) {
    if (isTrue(isAccessible)) {
      if (isDebugEnable) log.info(`URI ${pathname} is accessible: ${isAccessible}`)
    } else {
      const isNotAccessible = !menuURIs.includes(pathname)
      if (isDebugEnable) log.info('menuURIs: ', menuURIs, 'isAccessible: ', !isNotAccessible)
      if (isNotAccessible) {
        if (isDebugEnable) log.warn(`URI ${pathname} is not accessible for user: ${isNotAccessible}`)
        return <Navigate to={URIs.noPermission} />
      }
    }
  }

  return (
    <Watermark content={watermark()} inherit={false}>
      <Layout style={{ minHeight: '100vh' }}>
        <SidebarMenu />
        <Layout ref={windowRef} className={styles.rightSideWrapper}>
          <NavHeader />
          <TabFC />
          <Content className={styles.scrollWrapper} style={{ height: contentHeight }}>
            <div className={styles.contentWrapper}>
              <Outlet context={<Lazy Render={lazy(() => import('@/views/welcome'))} />} />
            </div>
            <NavFooter />
          </Content>
        </Layout>
      </Layout>
    </Watermark>
  )
}
