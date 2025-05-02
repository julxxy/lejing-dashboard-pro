import '@/App.css'

import { RouterProvider } from 'react-router-dom'
import { App as AntdApp, ConfigProvider, theme } from 'antd'
import { router } from '@/router'
import AntdGlobalProvider, { useThemeToken } from '@/context/AntdGlobalProvider.ts'
import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
import { Environment } from '@/types/enum.ts'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
import useZustandStore from '@/store/useZustandStore.ts'

if (Environment.isLocaleCN()) dayjs.locale('zh-cn')

function App() {
  const { isDarkEnable } = useZustandStore()
  return (
    <ConfigProvider
      theme={{
        ...useThemeToken,
        algorithm: isDarkEnable ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
      locale={Environment.isLocaleCN() ? zhCN : enUS}
    >
      <AntdApp>
        <AntdGlobalProvider />
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
