import isTrue from '@/common/isTrue.js'

/**
 * This function is used to check if the debug mode is enabled.
 */
function isDebugEnabled() {
  return isTrue(import.meta.env.VITE_IS_DEBUG_ENABLE)
}

export const isDebugEnable = isDebugEnabled()
