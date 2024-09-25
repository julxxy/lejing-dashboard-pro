import './App.css'
import { useRef, useState } from 'react'
import { log } from './common/Logger.ts'

function App() {

  const userRef = useRef<HTMLInputElement>(null)
  const [val, setVal] = useState('')
  const handleClick = () => {
    userRef.current?.focus()
    setVal(userRef.current?.value || '')
    log.debug(userRef.current?.className)
    log.debug(userRef.current?.id)
  }

  return (
    <>
      <div className={'App'}>
        <p>Welcome to Lejing Dashboard Pro</p>
        <input type="text"
               ref={userRef}
               className="red"
               id="user"
        />
        <button type="submit" onClick={handleClick}>Change Val</button>
        <p>Value: {val}</p>
      </div>
    </>
  )
}

export default App
