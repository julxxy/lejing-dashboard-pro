/**
 * Helper function library
 */

// Format CNY money amount
export const formatMoneyCNY = (amount: string | number | bigint): string => {
  const formater = new Intl.NumberFormat('zh-Hans-CN', {
    style: 'currency',
    currency: 'CNY'
  })

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  return isNaN(numericAmount) ? 'Invalid amount' : formater.format(numericAmount)
}

// Format date to date string
export const formatDateToLocalString = (date?: Date, pattern?: 'yyyy-MM-dd' | 'HH:mm:ss' | 'yyyy-MM-dd HH:mm:ss') => {
  const _date = date ? date : new Date()
  switch (pattern) {
    case 'yyyy-MM-dd':
      return _date.toLocaleDateString().replace(/\//g, '-')
    case 'HH:mm:ss':
      return _date.toLocaleTimeString()
    default:
      return _date.toLocaleString().replace(/\//g, '-')
  }
}
