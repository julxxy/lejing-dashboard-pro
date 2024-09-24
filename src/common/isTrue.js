/**
 * This function is used to convert a string or boolean value to boolean.
 */
function isTrue(value) {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value.toLowerCase() === '1'
  }
  return Boolean(value).valueOf()
}

export default isTrue
export const isFalse = (value) => !isTrue(value)
