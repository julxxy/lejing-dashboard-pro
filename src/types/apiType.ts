import { OrderStatus } from '@/types/appEnum.ts'

/**
 * API 入参定义
 */
export interface Result<T = any> {
  code: number
  data: T
  msg: string
}

export interface PageResult<T = any> {
  list: T[]
  page: {
    pageNum: number
    pageSize: number
    total: number | 0
  }
}

export interface PageArgs {
  pageNum?: number | 1
  pageSize?: number | undefined
}

export namespace Login {
  export interface Request {
    userName: string
    userPwd: string
  }
}

export namespace User {
  export interface RequestArgs extends PageArgs {
    userId?: number
    userName?: string
    userEmail?: string
  }

  export interface Info {
    userImg: string
    _id: string
    userId: number
    userName: string
    userEmail: string
    mobile: string
    deptId: string
    deptName: string
    job: string
    state: number
    role: number
    createId: number
    roleList: string
    regTime: string | null
    lastRegTime: string | null
  }

  export interface UserItem {
    _id: string
    userId: number
    userName: string
    userEmail: string
    deptId: string
    deptName: string
    state: number
    role: number
    roleList: string
    createId: number
    userImg: string
    createTime: string
    lastLoginTime: string
    job: string
    mobile: string
  }

  export interface UserAdd {
    userName: string
    userEmail: string
    mobile?: string
    deptId: string
    state?: number
    job?: string
    roleList: string[]
    userImg: string
  }

  export interface UserEdit extends UserAdd {
    userId: number
  }

  export interface PermissionItem {
    buttonList: string[]
    menuList: Menu.Item[]
  }
}

/**
 * Dashboard
 */
export namespace UcDashboard {
  export interface Report {
    driverCount: number
    totalMoney: number
    orderCount: number
    cityNum: 80
  }

  export interface OrderChartEntity {
    label: string[]
    order: number[]
    money: number[]
  }

  export interface CityChartEntity {
    value: number
    name: string
  }

  export interface AgeChartEntity {
    value: number
    name: string
  }

  export interface RadarChartEntity {
    indicator: Array<{ name: string; max: number }>
    data: [{ value: number[]; name: string }]
  }
}

/**
 * 部门管理
 */
export namespace Department {
  export interface SearchParams {
    deptName?: string
  }

  export interface Item {
    _id: string
    createTime: string
    updateTime: string
    deptName: string
    parentId: string
    userName: string
    children: Item[]
  }

  export interface CreateParams {
    deptName: string
    parentId?: string
    userName: string
  }

  export interface EditParams extends CreateParams {
    _id: string
  }

  export interface DeleteParams {
    _id: string
  }
}
/**
 * 菜单管理
 */
export namespace Menu {
  export interface SearchParams {
    menuName: string
    menuState: number
  }

  export interface RequestParams {
    menuName: string // 菜单名称
    icon?: string // 菜单图标
    menuType: number // 1: 菜单 2：按钮 3：页面
    menuState: number // 1：正常 2：停用
    menuCode?: string // 按钮权限标识
    parentId?: string // 父级菜单ID
    path?: string // 菜单路径
    component?: string // 组件名称
    orderBy: number
  }

  export interface Item extends RequestParams {
    _id: string
    createTime: string
    buttons?: Item[]
    children?: Item[]
  }

  export interface EditParams extends RequestParams {
    _id?: string
  }
}

/**
 * 角色权限
 */
export namespace Role {
  export interface SearchArgs extends PageArgs {
    roleName?: string
  }

  export interface CreateParams {
    roleName: string
    remark?: string
  }

  export interface EditParams extends CreateParams {
    _id: string
  }

  export interface RoleDetail extends CreateParams {
    _id: string
    permissionList: {
      checkedKeys: string[]
      halfCheckedKeys: string[]
    }
    updateTime: string
    createTime: string
  }

  export interface Permission {
    _id: string
    permissionList: {
      checkedKeys: string[]
      halfCheckedKeys: string[]
    }
  }
}

/**
 * 订单管理
 */
export namespace Order {
  export interface SearchArgs extends PageArgs {
    orderId?: string
    userName?: string
    state?: number
  }

  export interface CreateParams {
    cityName: string
    userName: string
    mobile: number | string
    startAddress: string //下单开始地址
    endAddress: string //下单结束地址
    orderAmount: number //订单金额
    userPayAmount: number //支付金额
    driverAmount: number //支付金额
    payType: number //支付方式: 1: 微信 2：支付宝
    driverName: string //司机名称
    vehicleName: string //订单车型
    state: OrderStatus // 订单状态: 1: 进行中 2：已完成 3：超时 4：取消
    useTime: string | Date | null // 用车时间
    endTime: string // 订单结束时间
  }

  export interface OrderDetail extends CreateParams {
    _id: string
    orderId: string //订单ID
    route: Array<{ lng: string; lat: string }> //行驶轨迹
    createTime: string | Date | null //创建时间
    remark: string //备注
  }

  /**
   * 城市列表
   */
  export interface CityDict {
    id: number
    name: string
  }

  export type VehicleDict = CityDict

  /**
   * 修改订单轨迹
   */
  export interface OrderRoute {
    orderId: string //订单ID
    route: Array<{ lng: string; lat: string }>
  }
}

export interface SideMenuProps {
  collapsed?: boolean
}
