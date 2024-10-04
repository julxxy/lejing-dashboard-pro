import React, { useEffect, useRef } from 'react'
import { Layout, Watermark } from 'antd'
import NaviHeader from '@/components/NaviHeader'
import NavFooter from '@/components/NavFooter'
import LeftSideMenu from '@/components/SideMenu'
import { Outlet } from 'react-router-dom'
import Welcome from '@/views/wlecome'
import styles from '@/layout/index.module.less'
import api from '@/api'
import useZustandStore from '@/store/useZustandStore.ts'
import Demo from '@/views/Demo.tsx'

const { Content } = Layout
const watermarkContent = import.meta.env.VITE_APP_ID as string

const LayoutFC: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null) // 创建引用
  const { setUserInfo } = useZustandStore() // 获取 store
  const getUserInfo = async () => {
    const [userInfo] = await Promise.all([api.getUserInfo()])
    setUserInfo(userInfo)
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <Watermark content={[watermarkContent]}>
      <Layout style={{ minHeight: '100vh' }}>
        <LeftSideMenu />
        <Layout ref={wrapperRef} className={styles.rightContentArea}>
          <NaviHeader />
          <Content className={styles.content}>
            <div className={styles.wrapper}>
              <Outlet context={<Welcome />} />
              {/*<Demo/>  内容超出 <Content/> 区域，撑最外层的，我希望滚动条出现在 <Content> 区域*/}
              <Demo />
            </div>
          </Content>
          <NavFooter />
        </Layout>
      </Layout>
    </Watermark>
  )
}

export default LayoutFC
