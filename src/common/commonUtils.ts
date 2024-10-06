/**
 * Common utility functions used across the project.
 */
export const commonUtils = {
  hasData(data: unknown): boolean {
    if (Array.isArray(data)) {
      return data.length > 0
    }
    if (typeof data === 'string') {
      return data.length > 0
    }
    if (typeof data === 'object' && data !== null) {
      return Object.keys(data).length > 0
    }
    return false
  },
  hasKey(data: unknown, key: string): boolean {
    if (data === null || data === undefined) {
      return false
    }
    if (typeof data === 'object') {
      return key in data
    }
    if (Array.isArray(data)) {
      return data.includes(key)
    }
    return false
  },
  hasValue(data: unknown, key: unknown): boolean {
    if (Array.isArray(data) && typeof key === 'number') {
      return Array.isArray(data[key]) ? data[key].length > 0 : !!data[key]
    } else {
      return this.hasKey(data, key as string)
    }
  },
}
