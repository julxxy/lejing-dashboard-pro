import { useEffect } from 'react'
import { log } from '@/common/Logger.ts'
import request from '@/utils/request.ts'

export default function Login() {
  useEffect(() => {
    request
      .post<string>('/users/login', {
        id: 123456
      })
      .then(res => {
        log.info(res)
      })
      .catch(err => {
        log.info(err)
      })
  }, [])
  return (
    <>
      <h1>Login</h1>
    </>
  )
}
