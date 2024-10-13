import React from 'react'
import * as Icons from '@ant-design/icons'
import { Button } from 'antd'

export interface DynamicAntIconProps {
  iconName: string | undefined // AntD icon图标名称
  label?: string // 图标标签
}

/**
 * 动态渲染 AntD 图标
 * @param iconName AntD icon图标名称
 * @param label 图标标签
 * @example
 * <DynamicAntIcon iconName="ApartmentOutlined" />
 */
const DynamicAntIcon: React.FC<DynamicAntIconProps> = ({ iconName, label }) => {
  if (!iconName) return null
  const AntIcon = Icons[iconName as keyof typeof Icons] as React.ComponentType
  if (!AntIcon) return null
  if (label) return <Button icon={<AntIcon />}>{label}</Button>
  return <AntIcon />
}

export default DynamicAntIcon
