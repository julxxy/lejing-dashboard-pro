import { Link, Navigate, useRoutes } from 'react-router-dom'
import App from './App.tsx'


// Use Routes

function RouterDemo() {
  return (
    <h2>
      欢迎使用 Lejing Dashboard Pro
      <Link to="..">Back</Link>
    </h2>
  )
}

function Vite() {
  return (
    <h2>欢迎使用 Vite 5.0 文档</h2>
  )
}

function Test() {
  return (
    // 重定向到 react 页面
    <h2> 欢迎使用 Lejing Dashboard Pro<Navigate to="/react" /></h2>
  )
}

function NotFound() {
  return (
    <h2>404, 页面不存在</h2>
  )
}


function Apple() {
  return (
    <h2>欢迎使用 Apple1 产品 <Link to="..">Back</Link></h2>
  )
}

function BaseRouter() {
  const routes = useRoutes([
    { path: '/', element: <App /> },
    { path: '/react', element: <RouterDemo /> },
    { path: '/vite', element: <Vite /> },
    { path: '/test', element: <Test /> },
    { path: '/apple', element: <Apple /> },
    { path: '*', element: <NotFound /> }
  ])
  return routes
}

export default BaseRouter
