/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  // Increment count handler
  const handleClick = () => setCount(count + 1)

  return (
    <>
      <div className={'App'}>
        <p>Welcome to Lejing Dashboard Pro</p>
        <p>
          <span>Count value: {count}</span>
          <button onClick={handleClick}>Increment</button>
        </p>
      </div>
    </>
  )
}

export default App
