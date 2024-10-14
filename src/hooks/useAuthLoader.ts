import { IRouteMeta, RouteConstants } from '@/router/DefaultAuthLoader.ts'
import { useRouteLoaderData } from 'react-router-dom'

/**
 * 获取路由权限信息
 */
export default function useAuthLoaderData(): IRouteMeta {
  return useRouteLoaderData(RouteConstants.layoutId) as IRouteMeta
}
