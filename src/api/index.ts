import { Login, User } from '@/types/apiTypes.ts'
import request from '@/utils/requestUtils.ts'

export default {
  // 登录
  login(params: Login.Request) {
    return request.post<string>(`/users/login`, params, { showLoading: false, showError: false })
  },
  // 获取用户信息
  getUserInfo(): User.Information {
    return request.get<User.Information>('/users/getUserInfo')
  },
}
