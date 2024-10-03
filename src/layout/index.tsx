import React, { useEffect, useState } from 'react'
import { Layout, Watermark } from 'antd'
import NaviHeader from '@/components/NaviHeader'
import NavFooter from '@/components/NavFooter'
import LeftSideMenu from '@/components/SideMenu'
import { Outlet } from 'react-router-dom'
import Welcome from '@/views/wlecome'
import styles from '@/layout/index.module.less'

const { Content, Sider } = Layout
const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const _collapsed = sessionStorage.getItem('collapsed') as unknown as boolean
    setCollapsed(_collapsed)
  }, [])

  return (
    <Watermark content={['lejing-mall']}>
      <Layout>
        <Sider>
          <LeftSideMenu collapsed={collapsed} />
        </Sider>
        <Layout>
          <NaviHeader />
          <Content className={styles.content}>
            <div className={styles.wrapper}>
              <Outlet context={<Welcome />} />
            </div>
            <NavFooter />
          </Content>
        </Layout>
      </Layout>
    </Watermark>
  )
}

export default App
