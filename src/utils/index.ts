/**
 * Helper function library
 */

// Format CNY money amount
export const formatMoneyCNY = (amount?: string | number | bigint): string => {
  if (!amount) amount = '0.00'
  const formater = new Intl.NumberFormat('zh-Hans-CN', {
    style: 'currency',
    currency: 'CNY',
  })

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  return isNaN(numericAmount) ? 'Invalid amount' : formater.format(numericAmount)
}

// Format number to string with comma
export const formatNumberWithComma = (num?: number | string): string => {
  if (!num) return '0'
  const numericNum = typeof num === 'string' ? parseFloat(num) : num
  return isNaN(numericNum) ? 'Invalid number' : numericNum.toLocaleString()
}

// Format date to date string
export const formatDateToLocalString = (
  date?: Date | string,
  pattern?: 'yyyy-MM-dd' | 'HH:mm:ss' | 'yyyy-MM-dd HH:mm:ss'
) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
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
export const formatUserStatus = (status: number | undefined): string => {
  if (status === 1) return '在职'
  if (status === 3) return '试用期'
  if (status === 2) return '离职'
  return ''
}
export const formatUserRole = (status: number | undefined): string => {
  if (status === 0) return '超级管理员'
  if (status === 1) return '管理员'
  if (status === 2) return '体验管理员'
  return ''
}
