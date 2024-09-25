import './App.css'
import { useEffect, useState } from 'react'
import useWindowSize from './useWindowSize.ts'

function App() {
  // useEffect语法讲解（模拟生命周期以及自定义Hook）

  const [count, setCount] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    document.title = 'Lejing Admin React App'
  }, []) // 只在组件挂载时执行

  useEffect(() => {
    setCount(count + 1)
  }, []) // 只在count变化时执行

  useEffect(() => {
    setTotal(count * 5)
  }, [count]) // 只在count变化时执行

  useEffect(() => {
    const T = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => {
      clearInterval(T)
    }
  }, [count]) // 每隔1秒执行一次

  // 使用自定义 hook
  const [size] = useWindowSize()

  return (
    <div className={'App'}>
      <h1>Welcome to Lejing Admin</h1>
      <p>
        Count: {count}, Total: {total}
      </p>
      <p>Window width: {size.width}, Window height: {size.height}</p>
    </div>
  )
}

export default App
