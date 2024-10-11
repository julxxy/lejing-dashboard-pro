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

  export interface SideMenuProps {
    collapsed?: boolean
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
