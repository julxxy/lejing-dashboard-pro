import React, { useEffect, useRef, useState } from 'react'
import styles from '@/views/dashboard/index.module.less'
import { Button, Card } from 'antd'
import { EChartsManager } from '@/context/EChartsManager.ts'
import { ReloadOutlined } from '@ant-design/icons'
import { log } from '@/common/loggerProvider.ts'

const DriverDistributionPieChart: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const cityRef = useRef<HTMLDivElement>(null)
  const ageRef = useRef<HTMLDivElement>(null)
  const cityOption = {
    title: { text: '城市', left: 'center', top: '50%' },
    legend: {
      orient: 'vertical',
      left: 'right',
    },
    series: [
      {
        name: '城市',
        type: 'pie',
        radius: [50, 150],
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 38, name: '北京' },
          { value: 40, name: '上海' },
          { value: 28, name: '广州' },
          { value: 18, name: '杭州' },
          { value: 30, name: '武汉' },
        ],
      },
    ],
  }

  const ageOption = {
    title: { text: '年龄', left: 'center', top: '50%' },
    legend: {
      orient: 'vertical',
      left: 'right',
    },
    series: [
      {
        name: '年龄',
        type: 'pie',
        radius: [50, 150],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 40, name: '北京' },
          { value: 38, name: '上海' },
          { value: 32, name: '广州' },
          { value: 26, name: '杭州' },
          { value: 30, name: '武汉' },
        ],
      },
    ],
  }
  useEffect(() => {
    const resizeCityChart = () => {
      const instance = EChartsManager.getInstanceIfNotPresent(cityRef)
      if (instance) {
        instance.setOption(cityOption)
        instance.resize()
      }
    }
    const resizeAgeChart = () => {
      const instance = EChartsManager.getInstanceIfNotPresent(ageRef)
      if (instance) {
        instance.setOption(ageOption)
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
      EChartsManager.destroy(cityRef, ageRef)
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
        <div className={styles.pieContainer}>
          <div id="pieChartCity" ref={cityRef} className={styles.pieItem} />
          <div id="pieChartAge" ref={ageRef} className={styles.pieItem} />
        </div>
      </Card>
    </div>
  )
}

export default DriverDistributionPieChart
