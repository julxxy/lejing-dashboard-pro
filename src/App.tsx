import '@/App.css'
import { RouterProvider } from 'react-router-dom'
import { App as AntdApp, ConfigProvider } from 'antd'
import { router } from '@/router'
import AntdGlobalProvider, { useThemeToken } from '@/context/AntdGlobalProvider.ts'

function App() {
  return (
    <>
      <ConfigProvider theme={{ ...useThemeToken }}>
        <AntdApp>
          <AntdGlobalProvider />
          <RouterProvider router={router} />
        </AntdApp>
      </ConfigProvider>
    </>
  )
}

export default App
