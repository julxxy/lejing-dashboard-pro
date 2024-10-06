import './App.css'
import { RouterProvider } from 'react-router-dom'
import { App as AntdApp, ConfigProvider } from 'antd'
import { router } from '@/router'
import AntdHelper from '@/utils/AntdHelper.ts'

function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#4096ff',
            borderRadius: 8,
          },
        }}
      >
        <AntdApp>
          <AntdHelper />
          <RouterProvider router={router} />
        </AntdApp>
      </ConfigProvider>
    </>
  )
}

export default App
