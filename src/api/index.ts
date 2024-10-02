import { Login } from '@/types/apiTypes.ts'
import request from '@/utils/requestUtils.ts'

export default {
  // 登录
  login(params: Login.Request) {
    return request.post(`/users/login`, params, { showLoading: false, showError: false })
  }
}
