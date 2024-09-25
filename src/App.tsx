import './App.css'
import { useState } from 'react'
import { flushSync } from 'react-dom'

function App() {
  /**
   * useState语法讲解（字符串、数字、数组、对象动态更新）
   */
    // 定义数据
  const [name, setName] = useState('Weasley')
  const [user, setUser] = useState({ name: 'John', age: 25 })
  const [list, setList] = useState(['Tom', 'Jack', 'Jane'])
  const [count, setCount] = useState(0)

  // 定义事件处理函数
  const handleUpdate = () => setName('John')
  const handleUserUpdate = () => setUser({ ...user, age: 30 })
  const handlerListUpdate = () => setList([...list, 'Sally'])
  const handlerCountUpdate = () => {
    // setCount(count + 1)

    // setTimeout(() => {
    //   setCount(count + 1)
    // }, 1000) // 模拟异步操作

    // setCount((count) => count + 1) // 也可以使用箭头函数

    // 强制刷新组件，同步更新数据
    flushSync(() => {
      setCount(count + 1)
      setCount(count + 1)
    })

    flushSync(() => {
      setCount(count + 1)
      setCount(count + 1)
    })

    // flushSync同步提高优先级，保证数据更新后再渲染组件，内部会合并成一次更新
  }

  return (
    <div className={'App'}>
      <h1>Welcome to Lejing Admin</h1>
      <p>
        <span>Username: {name}</span>
        <span style={{ marginLeft: 10 }}>User age: {user.age}</span>
      </p>
      <p>Count: {count}</p>
      <p>
        <span>
          {list.map((item, index) => {
            return (
              <span key={index} style={{ marginRight: 10 }}>
                {item}
              </span>
            )
          })}
        </span>
      </p>
      <p>
        <button onClick={handleUpdate}>Change Name</button>
        <button onClick={handleUserUpdate}>Update User Age</button>
        <button onClick={handlerListUpdate}>Update List</button>
        <button onClick={handlerCountUpdate}>Update Count</button>
      </p>
    </div>
  )
}

export default App
