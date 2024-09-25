import React, { useContext } from 'react'

const UserContext = React.createContext({ name: '' })

function App() {
  return (
    <UserContext.Provider value={{ name: 'Weasley' }}>
      <div>
        <p>Welcome to Lejing Dashboard Pro</p>
        <Child1st />
      </div>
    </UserContext.Provider>
  )
}

function Child1st() {
  return (
    <div>
      <p><span>Child-1</span></p>
      <p><Child2nd /></p>
    </div>
  )
}


function Child2nd() {
  const { name } = useContext(UserContext)
  return (
    <span>Child-2: Username: {name}</span>
  )
}

export default App
