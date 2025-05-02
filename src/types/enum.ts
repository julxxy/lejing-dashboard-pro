import { isFalse, isTrue } from '@/common/booleanUtils.ts'
import { base64Utils } from '@/common/base64Utils.ts'

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
  /**
   * 是否使用静态导航栏
   */
  isStaticMenuEnable: (): boolean => isTrue(import.meta.env.VITE_IS_STATIC_MENU_ENABLE),
  isLocaleCN: () => {
    const language = navigator.language || (navigator as any).userLanguage
    const isZhCN = language.toString().toLowerCase().includes('cn')
    return isTrue(isZhCN)
  },
  /**
   * 是否使用静态菜单布局
   */
  canUseStaticLayout: () => {
    const useAdminAccount = isTrue(import.meta.env.VITE_USE_ADMIN_ACCOUNT)
    const isStaticMenuDisabled = isFalse(import.meta.env.VITE_IS_STATIC_MENU_ENABLE)
    let account = useAdminAccount ? import.meta.env.VITE_ACCOUNT_ADMIN : import.meta.env.VITE_ACCOUNT_READONLY
    account = base64Utils.isBase64(account) ? base64Utils.decode(account) : account
    const name = JSON.parse(account).name as string
    let isJack = name.toLowerCase().startsWith('jack')
    isJack = !useAdminAccount
    return isStaticMenuDisabled && isJack
  },
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
  Failed = 40001,
}

/**
 * Order status
 */
export enum OrderStatus {
  doing = 1,
  done = 2,
  timeout = 3,
  cancel = 4,
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
