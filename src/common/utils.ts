/**
 * Common utility functions used across the project.
 */
export const utils = {
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
  hasKey(data: Record<string, unknown>, key: string): boolean {
    return data != null && key in data
  },
  hasValue(data: Record<string, unknown>, key: string): boolean {
    return this.hasKey(data, key) && (Array.isArray(data[key]) ? data[key].length > 0 : !!data[key])
  }
}
