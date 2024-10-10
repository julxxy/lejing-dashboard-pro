import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Layout, Watermark } from 'antd'
import NaviHeader from '@/components/NaviHeader'
import NavFooter from '@/components/NavFooter'
import LeftSideMenu from '@/components/SideMenu'
import styles from '@/layout/index.module.less'
import api from '@/api'
import useZustandStore from '@/store/useZustandStore.ts'
import { Outlet } from 'react-router-dom'
import { isTrue } from '@/common/booleanUtils.ts'
import Loading from '@/views/loading'
import { Environment } from '@/types/enums.ts'

const { Content } = Layout
const Welcome = lazy(() => import('@/views/welcome'))
const LayoutFC: React.FC = () => {
  // 获取水印配置
  const watermark = (): string[] => {
    const showWatermark = isTrue(import.meta.env.VITE_SHOW_WATERMARK)
    return showWatermark ? import.meta.env.VITE_APP_WATERMARKS.split(',') : []
  }
  const wrapperRef = useRef<HTMLDivElement>(null) // 创建引用
  const [contentHeight, setContentHeight] = useState<string>('100vh') // 默认视口高度
  const { setUserInfo } = useZustandStore() // 获取 store
  const getUserInfo = () => {
    const userInfo = api.getUserInfo()
    userInfo.userName = Environment.isLocal() ? 'admin' : userInfo.userName // TODO 上线后删除这行
    setUserInfo(userInfo)
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  // 动态计算内容区域的的高度
  useEffect(() => {
    const headerHeight = 64 // 假设导航栏高度为 64px
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

  return (
    <Watermark content={watermark()} inherit={false}>
      <Layout style={{ minHeight: '100vh' }}>
        <LeftSideMenu />
        <Layout ref={wrapperRef} className={styles.rightArea}>
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
