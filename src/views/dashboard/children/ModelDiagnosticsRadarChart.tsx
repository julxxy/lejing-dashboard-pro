import React, { useEffect, useRef, useState } from 'react'
import styles from '@/views/dashboard/index.module.less'
import { Button, Card } from 'antd'
import { EChartsManager } from '@/context/EChartsManager.ts'
import { ReloadOutlined } from '@ant-design/icons'
import { log } from '@/common/logger.ts'

const ModelDiagnosticsRadarChart: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const radarRef = useRef<HTMLDivElement>(null)
  const eChartsOption = {
    title: {},
    legend: {
      data: ['城市', '年龄'],
    },
    radar: {
      shape: 'circle',
      indicator: [
        { name: 'Sales', max: 6500 },
        { name: 'Administration', max: 16000 },
        { name: 'Information Technology', max: 30000 },
        { name: 'Customer Support', max: 38000 },
        { name: 'Development', max: 52000 },
        { name: 'Marketing', max: 25000 },
      ],
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: '城市',
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '年龄',
          },
        ],
      },
    ],
  }
  useEffect(() => {
    const resizeChart = () => {
      const instance = EChartsManager.getInstanceIfNotPresent(radarRef)
      if (instance) {
        instance.setOption(eChartsOption)
        instance.resize()
      }
    }
    const animationFrameId = requestAnimationFrame(resizeChart)
    window.addEventListener('resize', resizeChart)

    return () => {
      cancelAnimationFrame(animationFrameId)
      EChartsManager.destroy(radarRef)
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

export default ModelDiagnosticsRadarChart
