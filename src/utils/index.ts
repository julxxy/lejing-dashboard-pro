import { format } from 'date-fns'

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
  pattern: 'yyyy-MM-dd' | 'HH:mm:ss' | 'yyyy-MM-dd HH:mm:ss' = 'yyyy-MM-dd HH:mm:ss'
): string => {
  const _date = date ? new Date(date) : new Date()

  // 检查是否为有效日期
  if (isNaN(_date.getTime())) {
    throw new Error('Invalid date')
  }

  // 使用 date-fns 的 format 函数进行日期格式化
  return format(
    _date,
    pattern.replace(/yyyy/g, 'yyyy').replace(/dd/g, 'dd').replace(/HH/g, 'HH').replace(/mm/g, 'mm').replace(/ss/g, 'ss')
  )
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
