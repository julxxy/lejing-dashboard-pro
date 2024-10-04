import React, { useEffect, useRef, useState } from 'react'
import { Layout, Watermark } from 'antd'
import NaviHeader from '@/components/NaviHeader'
import NavFooter from '@/components/NavFooter'
import LeftSideMenu from '@/components/SideMenu'
import styles from '@/layout/index.module.less'
import api from '@/api'
import useZustandStore from '@/store/useZustandStore.ts'
import Welcome from '@/views/welcome'
import { Outlet } from 'react-router-dom'

const { Content } = Layout
const LayoutFC: React.FC = () => {
  const watermarks = import.meta.env.VITE_APP_WATERMARKS.split(',') || [] // 获取水印配置
  const wrapperRef = useRef<HTMLDivElement>(null) // 创建引用
  const [contentHeight, setContentHeight] = useState<string>('100vh') // 默认视口高度
  const { setUserInfo } = useZustandStore() // 获取 store
  const getUserInfo = async () => {
    const [userInfo] = await Promise.all([api.getUserInfo()])
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
    <Watermark content={watermarks}>
      <Layout style={{ minHeight: '100vh' }}>
        <LeftSideMenu />
        <Layout ref={wrapperRef} className={styles.rightContentArea}>
          <NaviHeader />
          <Content className={styles.content} style={{ height: contentHeight }}>
            <div className={styles.wrapper}>
              <Outlet context={<Welcome />} />
            </div>
          </Content>
          <NavFooter />
        </Layout>
      </Layout>
    </Watermark>
  )
}

export default LayoutFC
