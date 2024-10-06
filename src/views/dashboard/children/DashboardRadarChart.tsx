import React, { useEffect, useRef, useState } from 'react'
import styles from '@/views/dashboard/index.module.less'
import { Button, Card } from 'antd'
import { EChartsUtils } from '@/utils/EChartsUtils.ts'
import { ReloadOutlined } from '@ant-design/icons'
import { log } from '@/common/logger.ts'

const DashboardRadarChart: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const radarRef = useRef<HTMLDivElement>(null)
  const eChartsOption = {}
  useEffect(() => {
    const resizeChart = () => {
      const instance = EChartsUtils.getInstance(radarRef)
      if (instance) {
        instance.setOption(eChartsOption)
        instance.resize()
      }
    }
    const animationFrameId = requestAnimationFrame(resizeChart)
    window.addEventListener('resize', resizeChart)

    return () => {
      cancelAnimationFrame(animationFrameId)
      EChartsUtils.destroy(radarRef)
      window.removeEventListener('resize', resizeChart)
    }
  }, [])

  function onReloadClicked() {
    log.info('Reloading chart data')
    setLoading(!loading)
    setTimeout(() => setLoading(false), 1500) // Simulate loading time
  }

  return (
    <div className={styles.chart}>
      <Card
        className={styles.chart}
        title="模型诊断"
        extra={
          <Button
            icon={<ReloadOutlined />}
            shape={'circle'}
            loading={loading}
            size={'large'}
            color={'primary'}
            variant={'text'}
            onClick={onReloadClicked}
          />
        }
      >
        <div id="radarChart" ref={radarRef} className={styles.itemRadar} />
      </Card>
    </div>
  )
}

export default DashboardRadarChart
