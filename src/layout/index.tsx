import React, { useEffect, useRef } from 'react'
import { Layout, Watermark } from 'antd'
import NaviHeader from '@/components/NaviHeader'
import NavFooter from '@/components/NavFooter'
import LeftSideMenu from '@/components/SideMenu'
import { Outlet } from 'react-router-dom'
import Welcome from '@/views/wlecome'
import styles from '@/layout/index.module.less'
import api from '@/api'
import store from '@/store/userResso.ts'

const { Content, Sider } = Layout
const watermarkContent = import.meta.env.VITE_APP_ID as string

const LayoutFC: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null) // 创建引用
  const getUserInfo = async () => {
    const [userInfo] = await Promise.all([api.getUserInfo()])
    store.setUserInfo(userInfo)
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <Watermark content={[watermarkContent]}>
      <Layout style={{ minHeight: '100vh' }}>
        {/* LeftSideMenu 铺满屏幕左侧 */}
        <Sider className={styles.sider}>
          <LeftSideMenu />
        </Sider>
        {/* Right content area with NaviHeader and NavFooter */}
        <Layout className={styles.rightContentArea}>
          {/* NaviHeader 放在 Content 的顶部 */}
          <NaviHeader />
          <Content className={styles.content}>
            <div ref={wrapperRef} className={styles.wrapper}>
              <Outlet context={<Welcome />} />
            </div>
          </Content>
          {/* NavFooter 放在 Content 的底部 */}
          <NavFooter />
        </Layout>
      </Layout>
    </Watermark>
  )
}

export default LayoutFC
