/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import { useState, useTransition } from 'react'

function App() {
  const [query, setQuery] = useState('')
  const [list, setList] = useState<any>([])
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: any) => {
    setQuery(e.target.value) // update the query value

    startTransition(() => {
      // start a transition to update the list
      const arr = Array.from({ length: 5000 }).fill(1)
      setList([...list, ...arr])
    })
  }

  return (
    <>
      <div className={'App'}>
        <p>Welcome to Lejing Dashboard Pro</p>
        <input type="text" onChange={handleChange} value={query} />
        <div>
          {isPending ? (
            <p>Loading...</p>
          ) : (
            list.map((_item: number, index: number) => {
              return <p key={index}>{query}</p>
            })
          )}
        </div>
      </div>
    </>
  )
}

export default App
