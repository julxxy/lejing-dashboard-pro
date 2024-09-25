import { useEffect, useState } from 'react'

// 自定义Hook, 监听窗口大小变化
export default function useWindowSize() {
  // 定义一个useState，初始值为窗口大小
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  })

  // 初始化窗口大小
  const handleSize = () => {
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    })
  }

  useEffect(() => {
    window.addEventListener('resize', handleSize)
    return () => {
      window.removeEventListener('resize', handleSize) //
    }
  }, []) // 只在组件挂载时执行

  return [size]
}
