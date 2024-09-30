/**
 * Converts a string or boolean value to boolean.
 * - Returns true for the following string values: 'true', '1', 'on'.
 * - For boolean values, returns the value itself.
 * @param value - The value to be evaluated.
 * @returns True if the value represents a truthy state, false otherwise.
 */
function isTrue(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase()
    return lowerValue === 'true' || lowerValue === '1' || lowerValue === 'on'
  }
  return false
}

export default isTrue
export const isFalse = (value: unknown): boolean => !isTrue(value)
