import '@/App.css'
import { RouterProvider } from 'react-router-dom'
import { App as AntdApp, ConfigProvider } from 'antd'
import { router } from '@/router'
import AntdGlobalProvider, { useThemeToken } from '@/context/AntdGlobalProvider.ts'
import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
import { Environment } from '@/types/appEnum.ts'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'

if (Environment.isLocaleCN) dayjs.locale('zh-cn')

function App() {
  return (
    <>
      <ConfigProvider theme={{ ...useThemeToken }} locale={Environment.isLocaleCN ? zhCN : enUS}>
        <AntdApp>
          <AntdGlobalProvider />
          <RouterProvider router={router} />
        </AntdApp>
      </ConfigProvider>
    </>
  )
}

export default App
