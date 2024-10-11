/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PageNotFound from '@/views/error/Error404.tsx'
import NoPermission from '@/views/error/Error403.tsx'
import LoginFC from '@/views/login/Login.tsx'
import Layout from '@/layout/index.tsx'
import TestOverflow from '@/views/extra/TestOverflow.tsx'
import Loading from '@/views/loading'

/**
 * URIs in the app
 */
export const URIs = {
  home: '/',
  login: '/login',
  welcome: '/welcome',
  dashboard: '/dashboard',
  notFound: '/404',
  noPermission: '/403',
  overflowDemo: '/overflow',
  // system-menu
  userList: '/user/list',
  menuManage: '/menu/list',
  deptManage: '/dept/list',
  roleManage: '/role/list',
  // order-menu
  orderList: '/order/list',
  shipperManage: '/shipper/list',
  orderAggregation: '/order/aggregation',
}

/* Lazy load views */
const Welcome = lazy(() => import('@/views/welcome'))
const Dashboard = lazy(() => import('@/views/dashboard'))
/* system-menu */
const UserFC = lazy(() => import('@/views/system/user'))
const DepartmentFC = lazy(() => import('@/views/system/dept'))
const MenuList = lazy(() => import('@/views/system/menu'))
const RoleList = lazy(() => import('@/views/system/role'))
/* order-menu */
const OrderList = lazy(() => import('@/views/order/list'))
const DriverList = lazy(() => import('@/views/order/driver'))
const OrderAggregate = lazy(() => import('@/views/order/aggregation'))

/**
 * 路由配置
 */
const routes: RouteObject[] = [
  { path: URIs.home, element: <Navigate to={URIs.welcome} /> },
  { path: URIs.login, element: <LoginFC /> },
  {
    element: (
      <Suspense fallback={<Loading />}>
        <Layout />
      </Suspense>
    ),
    children: [
      { path: URIs.welcome, element: <Welcome /> },
      { path: URIs.dashboard, element: <Dashboard /> },
      { path: URIs.userList, element: <UserFC /> },
      { path: URIs.deptManage, element: <DepartmentFC /> },
      { path: URIs.menuManage, element: <MenuList /> },
      { path: URIs.roleManage, element: <RoleList /> },
      { path: URIs.orderList, element: <OrderList /> },
      { path: URIs.orderAggregation, element: <OrderAggregate /> },
      { path: URIs.shipperManage, element: <DriverList /> },
      { path: URIs.overflowDemo, element: <TestOverflow /> },
    ],
  },
  { path: '*', element: <Navigate to={URIs.notFound} /> },
  { path: URIs.notFound, element: <PageNotFound /> },
  { path: URIs.noPermission, element: <NoPermission /> },
]

// Create routing instance
export const router = createBrowserRouter(routes)
