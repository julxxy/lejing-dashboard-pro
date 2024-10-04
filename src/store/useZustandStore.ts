import { create } from 'zustand'
import { log } from '@/common/logger.ts'
import { isDebugEnable } from '@/common/debugEnable.ts'
import { User } from '@/types/apiTypes.ts'

/**
 * This is the store for the app. implemented using Zustand library.
 */
const useZustandStore = create<{
  /* state */
  token: string
  userInfo: User.Information
  collapsed: boolean

  /* setters */
  setToken: (token: string) => void
  setUserInfo: (userInfo: User.Information) => void
  setCollapsed: () => void
}>(set => ({
  /* state */
  token: '',
  userInfo: {} as User.Information,
  collapsed: false,

  /* setters */
  setToken: (token: string) => set(() => ({ token })),
  setUserInfo: (userInfo: User.Information) => {
    set(() => ({ userInfo }))
    logUpdate(userInfo) // Call logUpdate after setting userInfo
  },
  setCollapsed: () => {
    set(state => {
      const collapsed = state.collapsed
      logUpdate(collapsed)
      return { collapsed: !collapsed }
    })
  }
}))

function logUpdate(data: any) {
  if (isDebugEnable) log.debug('Zustand meta data update:', data)
}

export default useZustandStore
