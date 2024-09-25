/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import { memo, useCallback, useMemo, useState } from 'react'
import { log } from './common/Logger.ts'

function App() {
  const [count, setCount] = useState(0)

  // Computing total1 and total2 using useMemo and useCallback
  const total1 = () => {
    log.debug('total1 executed')
    const list = [1, 2, 3, 4, 5]
    return list.reduce((prev, current) => prev + current, 0)
  }

  const total2 = useMemo(() => {
    log.debug('total2 executed')
    const list = [1, 3, 5, 7, 9]
    return list.reduce((prev, current) => prev + current, 0)
  }, []) // useMemo will only execute when the dependencies change

  // Increment count handler
  const handleClick = () => setCount(count + 1)

  // Child component click handler
  const handleChildClick = useCallback(() => {
    log.debug('Child component clicked')
  }, []) // useCallback will only execute when the dependencies change

  return (
    <>
      <div className={'App'}>
        <p>Welcome to Lejing Dashboard Pro</p>
        <p>
          <span>Count value: {count}</span>
          <button onClick={handleClick}>Increment</button>
        </p>
        <p>{total1()}</p>
        <p>{total2}</p>
      </div>
      <Child onClick={handleChildClick}></Child>
    </>
  )
}

const Child = memo(({ onClick }: any) => {
  log.debug('Child component rendered')
  return (
    <div>
      <p>
        This is a child component
        <button onClick={onClick}>Button</button>
      </p>
    </div>
  )
})

export default App
