import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Router from '@/router'
import { ConfigProvider } from 'antd'

function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token，影响范围大
            // colorPrimary: '#00b96b',
            colorPrimary: '#4096ff',
            borderRadius: 6
            // 派生变量，影响范围小
            // colorBgContainer: '#f6ffed'
          }
        }}
      >
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ConfigProvider>
    </>
  )
  // return (<RouterProvider router={router} />)
}

export default App
