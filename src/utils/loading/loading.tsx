import { Spin } from 'antd'
import '@/utils/loading/loading.less'
import React from 'react'

export default function Loading({ tip = 'Loading...' }: { tip?: string }) {
  const contentStyle: React.CSSProperties = {
    padding: 50,
    borderRadius: 4
  }

  const content = <div style={contentStyle} />

  return (
    <>
      <Spin tip={tip} size={'large'}>
        {content}
      </Spin>
    </>
  )
}
