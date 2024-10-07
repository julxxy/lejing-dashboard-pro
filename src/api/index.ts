import { Login, UDashboard, User } from '@/types/apiTypes.ts'
import request from '@/utils/requestUtils.ts'

/**
 * API Request Management
 */
export default {
  // 登录
  login(params: Login.Request) {
    return request.post<string>(`/users/login`, params, { showLoading: false, showError: false })
  },
  // 获取用户信息
  getUserInfo(): User.Information {
    return request.get<User.Information>('/users/getUserInfo')
  },
  // 获取报表
  getReport(): UDashboard.Report {
    return request.get<UDashboard.Report>('/order/dashboard/getReportData')
  },
  // 获取订单图表数据
  getOrderChartData(): UDashboard.OrderChartEntity {
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
}
