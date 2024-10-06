import resso from 'resso'
import { User } from '@/types/apiTypes.ts'
import { isDebugEnable } from '@/common/debugEnable.ts'
import { log } from '@/common/logger.ts'

/**
 * Log meta update
 */
function logMetaUpdate(userInfo: User.Information) {
  if (isDebugEnable) log.debug('Resso meta data update:', userInfo)
}

/**
 * Create a store instance with initial this.state.
 * @deprecated Use `Zustand` instead.
 */
const store = resso({
  token: '',
  userInfo: {} as User.Information,
  setUserInfo: (userInfo: User.Information) => {
    store.userInfo = userInfo
    logMetaUpdate(userInfo)
  },
})

export default store // export the store instance
