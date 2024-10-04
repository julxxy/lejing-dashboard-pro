/**
 * API 入参定义
 */
export interface Result<T = any> {
  code: number
  data: T
  msg: string
}

export interface PageParams {
  pageNum: number
  pageSize: number
  list: any[]
}

export namespace Login {
  export interface Request {
    userName: string
    userPwd: string
  }
}

export namespace User {
  export interface Information {
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
  }
}

export interface SideMenuProps {
  collapsed?: boolean
}
