import React, { useEffect, useRef, useState } from 'react'
import styles from '@/views/dashboard/index.module.less'
import { Button, Card } from 'antd'
import { EchartsUtils } from '@/utils/echartsUtils.ts'
import { ReloadOutlined } from '@ant-design/icons'
import { log } from '@/common/logger.ts'

const DashboardPieChart: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const cityRef = useRef<HTMLDivElement>(null)
  const ageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const resizeCityChart = () => {
      const instance = EchartsUtils.getInstance(cityRef)
      if (instance) {
        instance.setOption({}) // todo
        instance.resize()
      }
    }
    const resizeAgeChart = () => {
      const instance = EchartsUtils.getInstance(ageRef)
      if (instance) {
        instance.setOption({}) // todo
        instance.resize()
      }
    }

    // 防止闪烁
    const cityAnimationFrameId = requestAnimationFrame(resizeCityChart)
    const ageAnimationFrameId = requestAnimationFrame(resizeAgeChart)

    // 监听窗口大小变化
    window.addEventListener('resize', resizeCityChart)
    window.addEventListener('resize', resizeAgeChart)

    // 防止内存泄露
    return () => {
      cancelAnimationFrame(cityAnimationFrameId)
      cancelAnimationFrame(ageAnimationFrameId)
      EchartsUtils.destroy(cityRef, ageRef)
      window.removeEventListener('resize', resizeCityChart)
      window.removeEventListener('resize', resizeAgeChart)
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
        title="司机分布"
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
        <div id="pieChartCity" ref={cityRef} className={styles.itemPie} />
        <div id="pieChartAge" ref={ageRef} className={styles.itemPie} />
      </Card>
    </div>
  )
}

export default DashboardPieChart
