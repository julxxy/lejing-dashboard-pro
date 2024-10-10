import { Department, Login, PageResult, UcDashboard, User } from '@/types/apiTypes.ts'
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
    return request.get<UcDashboard.Report>('/order/dashboard/getReportData')
  },
  // 获取订单图表数据
  getOrderChartData() {
    return request.get<UcDashboard.OrderChartEntity>('/order/dashboard/getLineData')
  },
  // 获取城市分布数据
  getDriverCityData() {
    return request.get<UcDashboard.CityChartEntity[]>('/order/dashboard/getPieCityData')
  },
  // 获取年龄分布数据
  getDriverAgeData() {
    return request.get<UcDashboard.AgeChartEntity[]>('/order/dashboard/getPieAgeData')
  },
  // 获取雷达图数据
  getDriverRadarData() {
    return request.get<UcDashboard.RadarChartEntity>('/order/dashboard/getRadarData')
  },

  /**
   * 用户管理
   */
  user: {
    // 获取用户列表
    getUserList(params: User.RequestArgs) {
      return request.get<PageResult<User.UserItem>>('/users/list', params)
    },
    // 获取当前登录者的所有用户
    getAllUsers() {
      return request.get<User.UserItem[]>('/users//all/list', {})
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
  },

  /**
   * 部门管理
   */
  dept: {
    // 获取部门列表
    getDepartments(params?: Department.SearchParams) {
      return request.get<Department.Item[]>('/dept/list', params)
    },
    // Add new department
    add(params: Department.CreateParams) {
      return request.post('/dept/create', params)
    },
    // Edit department
    edit(params: Department.EditParams) {
      return request.post('/dept/edit', params)
    },
    // Delete department
    delete(deptId: Department.DeleteParams) {
      return request.post('/dept/delete', deptId)
    },
  },

  /**
   * 菜单管理
   */
  menu: {},
  /**
   * 角色管理
   */
  role: {},
}
