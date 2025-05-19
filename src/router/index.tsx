// /* eslint-disable react-refresh/only-export-components */

import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import PageNotFound from '@/views/error/Error404.tsx'
import NoPermission from '@/views/error/Error403.tsx'
import LoginFC from '@/views/login/Login.tsx'
import Layout from '@/layout/index.tsx'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { defaultAuthLoader, RouteConstants } from '@/router/defaultAuthLoader.ts'
import { isFalse } from '@/common/booleanUtils.ts'
import Lazy from '@/components/Lazy.tsx'
import { Environment } from '@/types/enum.ts'
import { ApplicationAlgorithm } from '@/context/ApplicationAlgorithm.tsx'
import { Spin } from 'antd'

/**
 * URIs in the APP
 */
export const moduleURIs = { system: '/sys', order: '/order' }
export const URIs = {
  home: '/',
  login: '/login',
  welcome: '/welcome',
  dashboard: '/dashboard',
  overflow: '/overflow',
  notFound: '/404',
  noPermission: '/403',
  module: moduleURIs,
  system: {
    user: moduleURIs.system + '/user/list',
    menu: moduleURIs.system + '/menu/list',
    dept: moduleURIs.system + '/dept/list',
    role: moduleURIs.system + '/role/list',
  },
  order: {
    list: moduleURIs.order + '/list',
    shipper: moduleURIs.order + '/shipper',
    aggregation: moduleURIs.order + '/aggregation',
  },
}

if (isDebugEnable) log.info('Module URIs: \n', JSON.stringify(URIs, null, 2))
const publicURIs = [URIs.home, URIs.login, URIs.welcome, URIs.notFound, URIs.noPermission]
const isURIPublic = (path: string) => publicURIs.includes(path)

export type IRouteObject = RouteObject & { enableAuth?: boolean; children?: IRouteObject[] }

// Lazy load components
const components = {
  welcome: <Lazy Render={lazy(() => import('@/views/welcome'))} />,
  dashboard: <Lazy Render={lazy(() => import('@/views/dashboard'))} />,
  user: <Lazy Render={lazy(() => import('@/views/system/user'))} />,
  department: <Lazy Render={lazy(() => import('@/views/system/dept'))} />,
  menu: <Lazy Render={lazy(() => import('@/views/system/menu'))} />,
  role: <Lazy Render={lazy(() => import('@/views/system/role'))} />,
  order: <Lazy Render={lazy(() => import('@/views/order/list'))} />,
  insight: <Lazy Render={lazy(() => import('@/views/order/insights'))} />,
  shipper: <Lazy Render={lazy(() => import('@/views/order/shipper'))} />,
  overflow: <Lazy Render={lazy(() => import('@/views/extra/OverflowTest.tsx'))} />,
}

const jacksMenu: IRouteObject[] = [
  { path: '/welcome', element: components.welcome },
  { path: '/dashboard', element: components.dashboard },
  { path: '/userList', element: components.user },
  { path: '/deptList', element: components.department },
  { path: '/menuList', element: components.menu },
  { path: '/roleList', element: components.role },
  { path: '/orderList', element: components.order },
  { path: '/cluster', element: components.insight },
  { path: '/driverList', element: components.shipper },
]

/**
 * 路由配置
 * @apiNote 页面抖动很影响体验: 只对 Layout 进行加载，不包裹整个 Suspense
 */
export const routes: IRouteObject[] = [
  { path: URIs.home, element: <Navigate to={URIs.welcome} /> },
  { path: URIs.login, element: <LoginFC /> },
  {
    id: RouteConstants.layoutId,
    loader: defaultAuthLoader,
    element: <Layout />,
    hydrateFallbackElement: (
      <Spin tip="加载中..." size="large">
        <div style={{ backgroundColor: 'transparent' }} />
      </Spin>
    ),
    children: Environment.canUseStaticLayout()
      ? jacksMenu
      : [
          { path: URIs.welcome, element: components.welcome },
          { path: URIs.dashboard, element: components.dashboard },
          { path: URIs.overflow, element: components.overflow },
          {
            path: URIs.module.system,
            children: [
              { path: URIs.system.user, element: components.user },
              { path: URIs.system.dept, element: components.department },
              { path: URIs.system.menu, element: components.menu },
              { path: URIs.system.role, element: components.role },
            ],
          },
          {
            path: URIs.module.order,
            children: [
              { path: URIs.order.list, element: components.order },
              { path: URIs.order.aggregation, element: components.insight },
              { path: URIs.order.shipper, element: components.shipper },
            ],
          },
        ],
  },
  { path: '*', element: <Navigate to={URIs.notFound} /> },
  { path: URIs.notFound, element: <PageNotFound /> },
  { path: URIs.noPermission, element: <NoPermission /> },
]

// Create routing instance
export const router = createBrowserRouter(routes)
// URI is Accessible
export const isURIAccessible = (route?: string | null | undefined): boolean => {
  if (!route) return false
  if (isURIPublic(route)) return true
  const foundRoute = ApplicationAlgorithm.findRoute<IRouteObject>(routes, route)
  if (!foundRoute) return false
  if (foundRoute?.enableAuth === undefined) return false
  return isFalse(foundRoute.enableAuth)
}
