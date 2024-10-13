import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Layout, Watermark } from 'antd'
import NaviHeader from '@/components/NaviHeader'
import NavFooter from '@/components/NavFooter'
import LeftSideMenu from '@/components/SideMenu'
import styles from '@/layout/index.module.less'
import api from '@/api'
import useZustandStore from '@/store/useZustandStore.ts'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isTrue } from '@/common/booleanUtils.ts'
import Loading from '@/views/loading'
import { Environment } from '@/types/appEnums.ts'
import { isURIAccessible, URIs } from '@/router'
import { useAuthLoaderData } from '@/router/DefaultAuthLoader.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'

// 解构antd组件
const { Content } = Layout
// 获取水印配置
const watermark = (): string[] => {
  const showWatermark = isTrue(import.meta.env.VITE_SHOW_WATERMARK)
  return showWatermark ? import.meta.env.VITE_APP_WATERMARKS.split(',') : []
}
// 懒加载欢迎页
const Welcome = lazy(() => import('@/views/welcome'))
/**
 * Layout 组件
 * @constructor
 */
const LayoutFC: React.FC = () => {
  const { setUserInfo } = useZustandStore() // 获取 store
  const wrapperRef = useRef<HTMLDivElement>(null) // 创建引用
  const [contentHeight, setContentHeight] = useState<string>('100vh') // 默认视口高度
  const headerHeight = 64 // 导航栏高度为 64px
  // 获取用户信息
  const getUserInfo = async () => {
    const userInfo = await api.getUserInfo()
    userInfo.userName = Environment.isLocal() ? 'admin' : userInfo.userName // TODO 上线后删除这行
    setUserInfo(userInfo)
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  // 动态计算内容区域的的高度
  useEffect(() => {
    const updateHeight = () => {
      const newHeight = window.innerHeight - headerHeight
      setContentHeight(`${newHeight}px`)
    }
    updateHeight() // 初始化时计算高度
    window.addEventListener('resize', updateHeight) // 监听窗口大小变化
    return () => {
      window.removeEventListener('resize', updateHeight) // 清理事件监听器
    }
  }, [])

  // 路由权限校验 - start
  const { pathname } = useLocation()
  const routeMeta = useAuthLoaderData()
  const { menuURIs } = routeMeta
  const isAccessible = isURIAccessible(pathname)
  if (isTrue(isAccessible)) {
    if (isDebugEnable) log.info(`URI ${pathname} is accessible: ${isAccessible}`)
  } else {
    const isNotAccessible = !menuURIs.includes(pathname)
    if (isDebugEnable) log.info('menuURIs: ', menuURIs, isNotAccessible)
    if (isNotAccessible) {
      if (isDebugEnable) log.warn(`URI ${pathname} is not accessible for user: ${isNotAccessible}`)
      return <Navigate to={URIs.noPermission} />
    }
  }
  // 路由权限校验 - end

  return (
    <Watermark content={watermark()} inherit={false}>
      <Layout style={{ minHeight: '100vh' }}>
        <LeftSideMenu />
        <Layout ref={wrapperRef} className={styles.rightSideWrapper}>
          <NaviHeader />
          <Content className={styles.scrollWrapper} style={{ height: contentHeight }}>
            <div className={styles.contentWrapper}>
              <Suspense fallback={<Loading />}>
                <Outlet context={<Welcome />} />
              </Suspense>
            </div>
            <NavFooter />
          </Content>
        </Layout>
      </Layout>
    </Watermark>
  )
}

export default LayoutFC
