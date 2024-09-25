/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useReducer } from 'react'

const UserContext = React.createContext({})

export default function App() {
  const reducer = (state: string, action: { type: string, name: string }) => {
    switch (action.type) {
      case 'update_name':
        return action.name
      default:
        return state
    }
  }

  const [name, dispatch] = useReducer(reducer, 'Weasley')

  return (
    <>
      <UserContext.Provider value={{ name, dispatch }}>
        <h1>Welcome to Lejing Dashboard Pro</h1>
        <Child1st />
        <Child2nd />
      </UserContext.Provider>
    </>
  )
}


function Child1st() {
  const { dispatch }: any = useContext(UserContext)
  const handleClick = () => {
    dispatch({ type: 'update_name', name: Math.random() + '' })
  }
  return (
    <>
      <p>
        <span>Child-1</span>
        <button onClick={handleClick}>Change Name</button>
      </p>
    </>
  )
}

function Child2nd() {
  const { name }: any = useContext(UserContext)
  return (
    <>
      <p>
        <span>Child-2: {name}</span>
      </p>
    </>
  )
}
