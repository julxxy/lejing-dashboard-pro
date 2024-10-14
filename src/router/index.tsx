/* eslint-disable react-refresh/only-export-components */

import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PageNotFound from '@/views/error/Error404.tsx'
import NoPermission from '@/views/error/Error403.tsx'
import LoginFC from '@/views/login/Login.tsx'
import Layout from '@/layout/index.tsx'
import Loading from '@/views/loading'
import { isDebugEnable, log } from '@/common/Logger.ts'
import TestOverflow from '@/views/extra/TestOverflow.tsx'
import { DefaultAuthLoader, RouteConstants } from '@/router/DefaultAuthLoader.ts'
import { isFalse } from '@/common/booleanUtils.ts'

/**
 * URIs in the APP
 */
const moduleURIs = { system: '/sys', order: '/order' }

export const URIs = {
  home: '/',
  login: '/login',
  welcome: '/welcome',
  dashboard: '/dashboard',
  overflow: '/overflow',
  notFound: '/404',
  noPermission: '/403',
  module: moduleURIs,
  // 系统管理
  system: {
    userList: moduleURIs.system + '/user/list',
    menuList: moduleURIs.system + '/menu/list',
    deptList: moduleURIs.system + '/dept/list',
    roleList: moduleURIs.system + '/role/list',
  },
  // 订单管理
  order: {
    orderList: moduleURIs.order + '/list',
    shipperList: moduleURIs.order + '/shipper',
    orderAggregation: moduleURIs.order + '/aggregation',
  },
}
if (isDebugEnable) log.info('Module URIs: \n', JSON.stringify(URIs, null, 2))
const publicURIs = [URIs.home, URIs.login, URIs.welcome, URIs.notFound, URIs.noPermission]
const isURIPublic = (path: string) => publicURIs.includes(path)

/* Lazy load views */
const Welcome = lazy(() => import('@/views/welcome'))
const Dashboard = lazy(() => import('@/views/dashboard'))
const UserFC = lazy(() => import('@/views/system/user'))
const DepartmentFC = lazy(() => import('@/views/system/dept'))
const MenuList = lazy(() => import('@/views/system/menu'))
const RoleList = lazy(() => import('@/views/system/role'))
const OrderList = lazy(() => import('@/views/order/list'))
const ShipperList = lazy(() => import('@/views/order/shipper'))
const OrderAggregate = lazy(() => import('@/views/order/aggregation'))

/**
 * 路由配置
 */
export type IRouteObject = RouteObject & { enableAuth?: boolean }
export const routes: IRouteObject[] = [
  { path: URIs.home, element: <Navigate to={URIs.welcome} /> },
  { path: URIs.login, element: <LoginFC /> },
  {
    id: RouteConstants.layoutId,
    loader: DefaultAuthLoader,
    element: (
      <Suspense fallback={<Loading />}>
        <Layout />
      </Suspense>
    ),
    children: [
      { path: URIs.welcome, element: <Welcome /> },
      { path: URIs.dashboard, element: <Dashboard /> },
      { path: URIs.overflow, element: <TestOverflow /> },
      {
        path: URIs.module.system,
        children: [
          { path: URIs.system.userList, element: <UserFC /> },
          { path: URIs.system.deptList, element: <DepartmentFC /> },
          { path: URIs.system.menuList, element: <MenuList /> },
          { path: URIs.system.roleList, element: <RoleList /> },
        ],
      },
      {
        path: URIs.module.order,
        children: [
          { path: URIs.order.orderList, element: <OrderList /> },
          { path: URIs.order.orderAggregation, element: <OrderAggregate /> },
          { path: URIs.order.shipperList, element: <ShipperList /> },
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
export const isURIAccessible = (route?: string | null | undefined): boolean => {
  if (!route) return false
  if (isURIPublic(route)) return true
  // Recursive function to search for the route in nested routes
  const findRoute = (routes: IRouteObject[], route: string): IRouteObject | undefined => {
    for (const r of routes) {
      // Match route directly
      if (r.path === route) return r
      // If there are children, search recursively
      if (r.children) {
        const foundChild = findRoute(r.children, route)
        if (foundChild) return foundChild
      }
    }
    return undefined
  }
  const foundRoute = findRoute(routes, route)
  if (!foundRoute) return false
  if (foundRoute?.enableAuth === undefined) return false
  return isFalse(foundRoute.enableAuth)
}
