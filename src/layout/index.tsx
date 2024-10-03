import React, { useEffect, useRef, useState } from 'react'
import { Layout, Watermark } from 'antd'
import NaviHeader from '@/components/NaviHeader'
import NavFooter from '@/components/NavFooter'
import LeftSideMenu from '@/components/SideMenu'
import { Outlet } from 'react-router-dom'
import Welcome from '@/views/wlecome'
import styles from '@/layout/index.module.less'

const { Content, Sider } = Layout
const watermarkContent = import.meta.env.VITE_APP_ID as string

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null) // 创建引用

  useEffect(() => {
    const _collapsed = sessionStorage.getItem('collapsed') === 'true'
    setCollapsed(_collapsed)
  }, [])

  return (
    <Watermark content={[watermarkContent]}>
      <Layout style={{ minHeight: '100vh' }}>
        {/* LeftSideMenu 占据整个屏幕的左侧 */}
        <Sider style={{ height: '100vh' }}>
          <LeftSideMenu collapsed={collapsed} />
        </Sider>
        {/* Right content area with NaviHeader and NavFooter */}
        <Layout style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* NaviHeader 放在 Content 的顶部 */}
          <NaviHeader />
          <Content className={styles.content} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div ref={wrapperRef} className={styles.wrapper} style={{ flex: 1 }}>
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

export default App
