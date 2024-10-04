import { create } from 'zustand'
import { log } from '@/common/logger.ts'
import { isDebugEnable } from '@/common/debugEnable.ts'
import { User } from '@/types/apiTypes.ts'

/**
 * This is the store for the app. implemented using Zustand library.
 */

// Log meta update
function logUpdate(data: any) {
  if (isDebugEnable) log.debug('zustand meta data update:', data)
}

const useUserStore = create<{
  token: string
  userInfo: User.Information
  setToken: (token: string) => void
  setUserInfo: (userInfo: User.Information) => void
}>(set => ({
  token: '',
  userInfo: {} as User.Information,
  setToken: (token: string) => set(() => ({ token })),
  setUserInfo: (userInfo: User.Information) => {
    set(() => ({ userInfo }))
    logUpdate(userInfo) // Call logUpdate after setting userInfo
  }
}))

export default useUserStore
