/* eslint-disable react-refresh/only-export-components */
import '@/views/loading/loading.less'
import { Spin } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

let count = 0
export const showLoading = () => {
  if (count === 0) {
    const loading = document.getElementById('loading')
    loading?.style.setProperty('display', 'flex')
  }
  count++
}
export const hideLoading = () => {
  if (count < 0) return
  count--
  if (count === 0) {
    const loading = document.getElementById('loading')
    loading?.style.setProperty('display', 'none')
  }
}

// 延迟加载时显示的组件
const Loading: React.FC = () => {
  const [bgColor, setBgColor] = useState<string | null>(null) // 初始为 null，不影响第一次渲染
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (containerRef.current) {
      const parentBgColor = window.getComputedStyle(containerRef.current.parentElement!).backgroundColor
      // 仅当背景色不同才设置，以避免重复渲染导致闪烁
      if (parentBgColor !== bgColor) {
        setBgColor(parentBgColor)
      }
    }
  }, [bgColor]) // 仅当 bgColor 改变时，触发重新渲染

  return (
    <div ref={containerRef} className="lazy-loading-container">
      <Spin tip="加载中..." size="large">
        <div
          className="lazy-loading-content"
          style={{ backgroundColor: bgColor ?? 'transparent' }} // 使用父容器背景色或透明
        />
      </Spin>
    </div>
  )
}

export default Loading
