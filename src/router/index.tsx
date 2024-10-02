import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import Welcome from '@/views/Welcom.tsx'
import PageNotFound from '@/views/Error404.tsx'
import NoPermission from '@/views/Error403.tsx'
import LoginFC from '@/views/login/Login.tsx'

/**
 * 路由配置
 */
const routes: RouteObject[] = [
  { path: '/', element: <Welcome /> },
  { path: '/login', element: <LoginFC /> },
  { path: '*', element: <Navigate to="/404" /> },
  { path: '/404', element: <PageNotFound /> },
  { path: '/403', element: <NoPermission /> }
]

// 创建路由实例
export const router = createBrowserRouter(routes)
