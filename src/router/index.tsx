/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PageNotFound from '@/views/Error404.tsx'
import NoPermission from '@/views/Error403.tsx'
import LoginFC from '@/views/login/Login.tsx'
import Layout from '@/layout/index.tsx'
import OverflowDemo from '@/views/OverflowDemo.tsx'

/**
 * URIs in the app
 */
export const URIs = {
  home: '/',
  login: '/login',
  welcome: '/welcome',
  dashboard: '/dashboard',
  overflowDemo: '/overflow'
}

// Lazy load views
const Dashboard = lazy(() => import('@/views/dashboard'))
const Welcome = lazy(() => import('@/views/welcome'))

function Loading() {
  return (
    <div className="loading-spinner">
      <div>加载中...</div>
    </div>
  )
}

/**
 * 路由配置
 */
const routes: RouteObject[] = [
  { path: '/', element: <Navigate to={URIs.welcome} /> },
  { path: URIs.login, element: <LoginFC /> },
  {
    element: <Layout />,
    children: [
      {
        path: URIs.welcome,
        element: (
          <Suspense fallback={<Loading />}>
            <Welcome />
          </Suspense>
        )
      },
      {
        path: URIs.dashboard,
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        )
      },
      { path: URIs.overflowDemo, element: <OverflowDemo /> }
    ]
  },
  { path: '*', element: <Navigate to="/404" /> },
  { path: '/404', element: <PageNotFound /> },
  { path: '/403', element: <NoPermission /> }
]

// Create routing instance
export const router = createBrowserRouter(routes)
