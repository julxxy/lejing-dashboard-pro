import {
  Department,
  Login,
  Menu,
  Order,
  PageResult,
  Point,
  Result,
  Role,
  Shipper,
  UcDashboard,
  User,
} from '@/types/apiType.ts'
import apiClient from '@/api/apiClient.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { formatDateToLocalString } from '@/utils'

/**
 * API Request Entities Management
 */
export default {
  // 登录
  login(params: Login.Request) {
    return apiClient.post<string>('/users/login', params, { showLoading: false, showError: false })
  },
  // 获取用户信息
  getUserInfo() {
    return apiClient.get<User.Info>('/users/getUserInfo')
  },
  // 工作台
  dashboard: {
    // 获取报表
    getReport() {
      return apiClient.get<UcDashboard.Report>('/order/dashboard/getReportData')
    },
    // 获取订单图表数据
    getOrderChartData() {
      return apiClient.get<UcDashboard.OrderChartEntity>('/order/dashboard/getLineData')
    },
    // 获取城市分布数据
    getDriverCityData() {
      return apiClient.get<UcDashboard.CityChartEntity[]>('/order/dashboard/getPieCityData')
    },
    // 获取年龄分布数据
    getDriverAgeData() {
      return apiClient.get<UcDashboard.AgeChartEntity[]>('/order/dashboard/getPieAgeData')
    },
    // 获取雷达图数据
    getDriverRadarData() {
      return apiClient.get<UcDashboard.RadarChartEntity>('/order/dashboard/getRadarData')
    },
  },
  // 用户管理
  user: {
    // 获取用户列表
    getUserList(params: User.RequestArgs) {
      return apiClient.get<PageResult<User.UserItem>>('/users/list', params)
    },
    // 获取当前登录者的所有用户
    getAllUsers() {
      return apiClient.get<User.UserItem[]>('/users//all/list', {})
    },
    // Add new user
    addUser(params: User.UserAdd) {
      return apiClient.post<Result>('/users/create', params)
    },
    // Edit User
    editUser(params: User.UserEdit) {
      return apiClient.post<Result>('/users/edit', params)
    },
    // Delete user
    deleteUser(userIds: number[]) {
      return apiClient.post<Result>('/users/delete', { userIds })
    },
    //   Permission list
    getPermissions() {
      return apiClient.get<User.PermissionItem>('/users/getPermissionList')
    },
  },

  // 部门管理
  dept: {
    // 获取部门列表
    getDepartments(params?: Department.SearchParams) {
      return apiClient.get<Department.Item[]>('/dept/list', params)
    },
    // Add new department
    add(params: Department.CreateParams) {
      return apiClient.post<Result>('/dept/create', params)
    },
    // Edit department
    edit(params: Department.EditParams) {
      return apiClient.post<Result>('/dept/edit', params)
    },
    // Delete department
    delete(deptId: Department.DeleteParams) {
      return apiClient.post<Result>('/dept/delete', deptId)
    },
  },

  // 菜单管理
  menu: {
    getMenus(params: Menu.SearchParams | undefined) {
      return apiClient.get<Menu.Item[]>('/menu/list', params)
    },
    add(params: Menu.RequestParams) {
      return apiClient.post<Result>('/menu/create', params)
    },
    edit(params: Menu.EditParams) {
      return apiClient.post<Result>('/menu/edit', params)
    },
    delete(_id: string) {
      return apiClient.post<Result>('/menu/delete', { _id })
    },
  },

  // 角色管理
  role: {
    page(params: Role.SearchArgs) {
      return apiClient.get<PageResult<Role.RoleDetail>>('/roles/list', params)
    },
    add(params: Role.CreateParams) {
      return apiClient.post('/roles/create', params)
    },
    edit(params: Role.EditParams) {
      return apiClient.post('/roles/edit', params)
    },
    delete(_id: string) {
      return apiClient.post('/roles/delete', { _id })
    },
    setPermission(params: Role.Permission) {
      return apiClient.post('/roles/update/permission', params)
    },
    getAll() {
      return apiClient.get<Role.RoleDetail[]>('/roles/allList')
    },
  },

  // 订单管理
  order: {
    add(params: Order.CreateParams) {
      return apiClient.post('/order/create', params)
    },
    delete(orderIds?: string[]) {
      if (!orderIds) return
      orderIds.forEach(id => {
        apiClient.post('/order/delete', { _id: id }).then(res => {
          if (isDebugEnable) log.info('删除订单成功: ', res)
        })
      })
    },
    update(params?: Order.OrderRoute) {
      return apiClient.post('/order/edit', params)
    },
    getOrderDetail(orderId: string) {
      return apiClient.get<Order.OrderDetail>(`/order/detail/${orderId}`)
    },
    getShipperList() {},
    getOrderList(params: Order.SearchArgs) {
      return apiClient.get<PageResult<Order.OrderDetail>>('/order/list', params)
    },
    getCities() {
      return apiClient.get<Order.CityDict[]>('/order/cityList')
    },
    getOrderVehicles() {
      return apiClient.get<Order.VehicleDict[]>('/order/vehicleList')
    },
    exportExcel(params: any) {
      return apiClient.download(
        '/order/orderExport',
        params,
        `订单数据_${formatDateToLocalString(new Date(), 'yyyyMMddHHmm')}.xlsx`
      )
    },
    // 订单聚合热力图数据
    getCityHeatMapPoints(cityCode: string) {
      return apiClient.get<Point[]>(`/order/cluster/${cityCode}`)
    },
  },

  // 货运人员
  shipper: {
    getShipperList(params: Shipper.SearchParams) {
      return apiClient.get<PageResult<Shipper.ShipperInfo>>('/order/driver/list', params)
    },
  },
}
