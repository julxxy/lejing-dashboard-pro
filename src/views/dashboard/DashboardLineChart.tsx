import React, { useEffect, useRef, useState } from 'react'
import styles from '@/views/dashboard/index.module.less'
import { Button, Card } from 'antd'
import { EchartsUtils } from '@/utils/echartsUtils.ts'
import { ReloadOutlined } from '@ant-design/icons'
import { log } from '@/common/logger.ts'

const DashboardLineChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  // const { isDarkEnable } = useZustandStore()

  const [loading, setLoading] = useState(false)

  // Mock data for 12 months
  const eChartsOption = {
    title: {
      text: null // No title
    },
    xAxis: {
      type: 'category',
      data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] // 12 months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 930, 1000, 1200, 1300, 1100, 950, 1400, 1500, 1600, 1700, 1800], // Mock data for each month
        type: 'line'
      }
    ]
  }

  useEffect(() => {
    const resizeChart = () => {
      const instance = EchartsUtils.getInstance(chartRef)
      if (instance) {
        instance.setOption(eChartsOption)
        instance.resize() // Resize the chart on window resize
      }
    }
    const animationFrameId = requestAnimationFrame(resizeChart) // To prevent flickering
    window.addEventListener('resize', resizeChart) // Listen for window size changes
    return () => {
      cancelAnimationFrame(animationFrameId) // Clean up the animation frame
      EchartsUtils.destroy(chartRef) // Destroy the chart instance when component unmounts
      window.removeEventListener('resize', resizeChart) // Remove the resize event listener
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
        title="订单交易趋势"
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
        <div id="lineChart" ref={chartRef} className={styles.itemLine} />
      </Card>
    </div>
  )
}

export default DashboardLineChart
