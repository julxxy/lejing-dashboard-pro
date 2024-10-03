import React from 'react'
import { Layout, theme, Watermark } from 'antd'
import { log } from '@/common/logger.ts'
import { isDebugEnable } from '@/common/debugEnable.ts'
import NaviHeader from '@/components/NaviHeader'

const { Header, Content, Footer, Sider } = Layout
const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  return (
    <Watermark content={['lejing-mall']}>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            if (isDebugEnable) log.debug(broken)
          }}
          onCollapse={(collapsed, type) => {
            if (isDebugEnable) log.debug(collapsed, type)
          }}
        >
          侧边栏
        </Sider>
        <Layout>
          <Header style={{ height: 50, padding: 0, background: colorBgContainer }}>
            <NaviHeader />
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG
              }}
            >
              <span>Content</span>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Lejing Dashboard Pro ©{new Date().getFullYear()} Created by Weasley
          </Footer>
        </Layout>
      </Layout>
    </Watermark>
  )
}

export default App
