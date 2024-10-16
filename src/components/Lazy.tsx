import '@/views/loading/loading.less'
import React, { LazyExoticComponent, Suspense, useEffect, useRef, useState } from 'react'
import { Spin } from 'antd'

interface LazyProps {
  Component: LazyExoticComponent<React.FC> | React.FC
}

/**
 * 延迟加载时显示的组件
 * @example
 * <Lazy Component={UserFC} />
 */
const Lazy: React.FC<LazyProps> = ({ Component }) => {
  const [bgColor, setBgColor] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      const parentBgColor = window.getComputedStyle(containerRef.current.parentElement!).backgroundColor
      if (parentBgColor !== bgColor) {
        setBgColor(parentBgColor)
      }
    }
  }, [bgColor])

  return (
    <Suspense
      fallback={
        <div ref={containerRef} className="lazy-container">
          <Spin tip="加载中..." size="large">
            <div className="lazy-content" style={{ backgroundColor: bgColor ?? 'transparent' }}></div>
          </Spin>
        </div>
      }
    >
      <Component />
    </Suspense>
  )
}

export default Lazy
