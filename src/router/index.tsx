/* eslint-disable react-refresh/only-export-components */

import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import PageNotFound from '@/views/error/Error404.tsx'
import NoPermission from '@/views/error/Error403.tsx'
import LoginFC from '@/views/login/Login.tsx'
import Layout from '@/layout/index.tsx'
import { isDebugEnable, log } from '@/common/Logger.ts'
import TestOverflow from '@/views/extra/TestOverflow.tsx'
import { defaultAuthLoader, RouteConstants } from '@/router/defaultAuthLoader.ts'
import { isFalse } from '@/common/booleanUtils.ts'
import Lazy from '@/components/Lazy.tsx'
import { Environment } from '@/types/appEnum.ts'

/* Lazy load views */
const Welcome = lazy(() => import('@/views/welcome'))
const Dashboard = lazy(() => import('@/views/dashboard'))
const UserFC = lazy(() => import('@/views/system/user'))
const DepartmentFC = lazy(() => import('@/views/system/dept'))
const MenuList = lazy(() => import('@/views/system/menu'))
const RoleList = lazy(() => import('@/views/system/role'))
const OrderList = lazy(() => import('@/views/order/list'))
const ShipperList = lazy(() => import('@/views/order/shipper'))
const OrderAggregate = lazy(() => import('@/views/order/aggr'))

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

const jacksMenu: IRouteObject[] = [
  { path: '/welcome', element: <Lazy Component={Welcome} /> },
  { path: '/dashboard', element: <Lazy Component={Dashboard} /> },
  { path: '/userList', element: <Lazy Component={UserFC} /> },
  { path: '/deptList', element: <Lazy Component={DepartmentFC} /> },
  { path: '/menuList', element: <Lazy Component={MenuList} /> },
  { path: '/roleList', element: <Lazy Component={RoleList} /> },
  { path: '/orderList', element: <Lazy Component={OrderList} /> },
  { path: '/cluster', element: <Lazy Component={OrderAggregate} /> },
  { path: '/driverList', element: <Lazy Component={ShipperList} /> },
]

/**
 * 路由配置
 * @apiNote 页面抖动很影响体验: 只对 Layout 进行加载，不包裹整个 Suspense
 */
export type IRouteObject = RouteObject & { enableAuth?: boolean }
export const routes: IRouteObject[] = [
  { path: URIs.home, element: <Navigate to={URIs.welcome} /> },
  { path: URIs.login, element: <LoginFC /> },
  {
    id: RouteConstants.layoutId,
    loader: defaultAuthLoader,
    element: <Layout />,
    children: Environment.canUseStaticLayout()
      ? jacksMenu
      : [
        { path: URIs.welcome, element: <Lazy Component={Welcome} /> },
        { path: URIs.dashboard, element: <Lazy Component={Dashboard} /> },
        { path: URIs.overflow, element: <Lazy Component={TestOverflow} /> },
        {
          path: URIs.module.system,
          children: [
            { path: URIs.system.user, element: <Lazy Component={UserFC} /> },
            { path: URIs.system.dept, element: <Lazy Component={DepartmentFC} /> },
            { path: URIs.system.menu, element: <Lazy Component={MenuList} /> },
            { path: URIs.system.role, element: <Lazy Component={RoleList} /> },
          ],
        },
        {
          path: URIs.module.order,
          children: [
            { path: URIs.order.list, element: <Lazy Component={OrderList} /> },
            { path: URIs.order.aggregation, element: <Lazy Component={OrderAggregate} /> },
            { path: URIs.order.shipper, element: <Lazy Component={ShipperList} /> },
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
