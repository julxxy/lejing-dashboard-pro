// API 入参定义

export interface Result<T = any> {
  code: number
  data: T
  msg: string
}

export namespace Login {
  export interface Request {
    userName: string
    userPwd: string
  }
}
