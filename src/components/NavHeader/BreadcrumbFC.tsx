import { URIs } from '@/router'
import { Breadcrumb } from 'antd'
import { useEffect, useState } from 'react'
import useAuthLoaderData from '@/hooks/useAuthLoader.ts'
import { useLocation } from 'react-router-dom'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { ApplicationAlgorithm, BreadcrumbNodeProps } from '@/context/ApplicationAlgorithm.tsx'

// 顶部菜单右侧按钮
export default function BreadcrumbFC() {
  const routeMeta = useAuthLoaderData()
  const { pathname } = useLocation()
  const [itemPaths, setItemPaths] = useState<BreadcrumbNodeProps[]>([])

  // 路径发生变化时更新顶部导航栏路径
  useEffect(() => {
    const paths = ApplicationAlgorithm.findDynamicBreadcrumbItems(routeMeta.menus, pathname, [])
    if (isDebugEnable) log.info('顶部导航栏树形解构: ', paths)
    if (paths.length === 0) {
      // 兜底
      setItemPaths([{ title: '首页', href: URIs.home }])
    } else {
      setItemPaths([{ title: <a href={URIs.home}>首页</a> }, ...paths])
    }
  }, [pathname])

  return <Breadcrumb items={itemPaths} style={{ marginLeft: 10 }} />
}
