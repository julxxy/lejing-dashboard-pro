import request from '@/utils/request.ts'
import { Login } from '@/types/apiTypes.ts'

export default {
  // 登录
  login(params: Login.Request) {
    return request.post('/users/login', params)
  }
}
