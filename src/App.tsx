import './App.css'
import { log } from './common/Logger.ts'

function App() {
  const hello = 'Hello: '
  const isAdmin = true
  const style = { color: 'red', fontSize: '20px' }
  const name = <span style={style}>Wesley J</span>
  const fruits = [<span key={'tom'}>{'orange'}</span>, 'apple', 'banana', 'orange']
  const userName = 'Wesley J'

  function handleChange(e: any) {
    log.debug(e.target.value)
  }

  return (
    <>
      <div>
        <p>
          {hello} {name}
        </p>
        <p>{isAdmin ? '你好，Admin' : <span>普通访客</span>}</p>
        <p>Fruit list</p>
        <p>
          {fruits.map((fruit, index) => {
            return <span key={index}>{fruit},</span>
          })}
        </p>
        <input onChange={handleChange} />
        <input value={userName} onChange={handleChange} />
      </div>
    </>
  )
}

export default App
