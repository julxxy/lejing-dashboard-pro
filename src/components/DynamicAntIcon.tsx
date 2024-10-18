import React from 'react'
import * as Icons from '@ant-design/icons'

// 定义图标类型
interface DynamicAntIconProps extends React.HTMLAttributes<HTMLElement> {
  iconName?: string // AntD 图标名称
}

/**
 * 动态渲染 AntD 图标
 * @example
 * <DynamicAntIcon iconName="ApartmentOutlined" />
 */
const DynamicAntIcon: React.FC<DynamicAntIconProps> = ({ iconName, ...props }) => {
  if (!iconName) return null
  const AntIcon = Icons[iconName as keyof typeof Icons] as React.FC
  if (!AntIcon) return null
  return <AntIcon {...props} />
}

export default DynamicAntIcon
