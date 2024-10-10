import { Login, PageResult, UDashboard, User } from '@/types/apiTypes.ts'
import request from '@/utils/httpUtils.ts'

/**
 * API Request Management
 */
export default {
  // 登录
  login(params: Login.Request) {
    return request.post<string>(`/users/login`, params, { showLoading: false, showError: false })
  },
  // 获取用户信息
  getUserInfo() {
    return request.get<User.Info>('/users/getUserInfo')
  },
  // 获取报表
  getReport() {
    return request.get<UDashboard.Report>('/order/dashboard/getReportData')
  },
  // 获取订单图表数据
  getOrderChartData() {
    return request.get<UDashboard.OrderChartEntity>('/order/dashboard/getLineData')
  },
  // 获取城市分布数据
  getDriverCityData() {
    return request.get<UDashboard.CityChartEntity[]>('/order/dashboard/getPieCityData')
  },
  // 获取年龄分布数据
  getDriverAgeData() {
    return request.get<UDashboard.AgeChartEntity[]>('/order/dashboard/getPieAgeData')
  },
  // 获取雷达图数据
  getDriverRadarData() {
    return request.get<UDashboard.RadarChartEntity>('/order/dashboard/getRadarData')
  },
  // 获取用户列表
  getUserList(params: User.RequestArgs) {
    return request.get<PageResult<User.UserItem>>('/users/list', params)
  },
  // Add new user
  addUser(params: User.UserAdd) {
    return request.post('/users/create', params)
  },
  // Edit User
  editUser(params: User.UserEdit) {
    return request.post('/users/edit', params)
  },
  // Delete user
  deleteUser(userIds: number[]) {
    return request.post('/users/delete', { userIds })
  },
}
