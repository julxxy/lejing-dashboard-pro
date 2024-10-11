/**
 * App environment
 */
export const Environment = {
  prod: 'production',
  dev: 'development',
  local: 'developer_local',
  current: import.meta.env.MODE,
  isProduction: (): boolean => Environment.current === Environment.prod,
  isNotProduction: (): boolean => Environment.current !== Environment.prod,
  isLocal: (): boolean => Environment.current === Environment.local,
  isDevelopment: (): boolean => Environment.current === Environment.dev,
} as const

/**
 * User roles
 */
export enum UserRoles {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST',
}

/**
 * User status
 */
export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Suspended = 'SUSPENDED',
}

/**
 * HTTP result status
 */
export enum ResultStatus {
  Success = 0,
}

/**
 * Menu Type
 */
export const MenuType = {
  menu: { code: 1, text: '菜单' },
  btn: { code: 2, text: '按钮' },
  page: { code: 3, text: '页面' },
  getName: (_code: number): string => {
    for (const key in MenuType) {
      const item = MenuType[key as keyof typeof MenuType]
      if (typeof item === 'object' && item.code === _code) {
        return item.text
      }
    }
    return '未知'
  },
} as const
