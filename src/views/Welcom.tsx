import { Button } from 'antd'
import request from '@/utils/request.ts'
import { log } from '@/common/Logger.ts'
import { useEffect, useState } from 'react'
import storage from '@/utils/storage.ts'

log.info(import.meta.env)
export default function Welcome() {
  const [val, setVal] = useState('')

  useEffect(() => {
    handleClick()
  }, [])

  async function handleClick() {
    const response = await request.post<string>('/users/login', {})
    log.info(response)
  }

  function handleClick1() {
    storage.set('user', { age: 10, name: 'lejing', id: 1 })
  }

  function handleClick2() {
    const obj = storage.get<object>('user')
    setVal(JSON.stringify(obj))
  }

  function handleClick3() {
    storage.remove('user')
    handleClick2()
  }

  function handleClick4() {
    storage.clear()
  }

  return (
    <>
      <div className="welcome">Welcome to Lejing Dashboard Pro</div>
      <p>
        <Button onClick={handleClick}>点击事件</Button>
        <Button onClick={handleClick1}>Set</Button>
        <Button onClick={handleClick2}>Get</Button>
        <Button onClick={handleClick3}>Delete</Button>
        <Button onClick={handleClick4}>Clear</Button>
      </p>
      <p>{val ? val : ''}</p>
    </>
  )
}
