import resso from 'resso'
import { User } from '@/types/apiTypes.ts'
import { isDebugEnable } from '@/common/debugProvider.ts'
import { log } from '@/common/loggerProvider.ts'

/**
 * Log meta update
 */
function logMetaUpdate(userInfo: User.Info) {
  if (isDebugEnable) log.debug('Resso meta data update:', userInfo)
}

/**
 * Create a store instance with initial this.state.
 * @deprecated Use `Zustand` instead.
 */
const store = resso({
  token: '',
  userInfo: {} as User.Info,
  setUserInfo: (userInfo: User.Info) => {
    store.userInfo = userInfo
    logMetaUpdate(userInfo)
  },
})

export default store // export the store instance
