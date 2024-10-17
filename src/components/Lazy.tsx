import '@/views/loading/loading.less'
import React, { LazyExoticComponent, startTransition, Suspense, useEffect, useRef, useState } from 'react'
import { Spin } from 'antd'

interface LazyProps {
  Component: LazyExoticComponent<React.FC> | React.FC
}

/**
 * 延迟加载 HOC 组件
 * @author weasley
 * @example
 * <Lazy Component={Dashboard} />
 */
const Lazy: React.FC<LazyProps> = ({ Component }) => {
  const [bgColor, setBgColor] = useState<string | null>(null)
  const fallbackRef = useRef<HTMLDivElement | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const fallback = (
    <div ref={fallbackRef} className="lazy-container">
      <Spin tip="加载中..." size="large">
        <div className="lazy-content" style={{ backgroundColor: bgColor ?? 'transparent' }}></div>
      </Spin>
    </div>
  )

  useEffect(() => {
    if (fallbackRef.current) {
      const parentBgColor = window.getComputedStyle(fallbackRef.current.parentElement!).backgroundColor
      if (parentBgColor !== bgColor) {
        setBgColor(parentBgColor)
      }
    }
  }, [bgColor])

  useEffect(() => {
    startTransition(() => setIsTransitioning(false))
  }, [])

  if (isTransitioning) {
    return fallback
  }

  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  )
}

export default Lazy
