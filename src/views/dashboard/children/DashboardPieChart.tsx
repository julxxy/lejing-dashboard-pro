import React, { useEffect, useRef, useState } from 'react'
import styles from '@/views/dashboard/index.module.less'
import { Button, Card } from 'antd'
import { EChartsUtils } from '@/utils/EChartsUtils.ts'
import { ReloadOutlined } from '@ant-design/icons'
import { log } from '@/common/logger.ts'

const DashboardPieChart: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const cityRef = useRef<HTMLDivElement>(null)
  const ageRef = useRef<HTMLDivElement>(null)
  const cityOption = {
    title: { text: '城市分布', left: 'center', top: '50%' },
    legend: {},
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: '城市分布',
        type: 'pie',
        radius: [50, 200], // 缩小内外半径
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 40, name: 'rose 1' },
          { value: 38, name: 'rose 2' },
          { value: 32, name: 'rose 3' },
          { value: 30, name: 'rose 4' },
          { value: 28, name: 'rose 5' },
          { value: 26, name: 'rose 6' },
          { value: 22, name: 'rose 7' },
          { value: 18, name: 'rose 8' },
        ],
      },
    ],
  }

  const ageOption = {
    title: { text: '年龄分布', left: 'center', top: '50%' },
    legend: {},
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: '年龄分布',
        type: 'pie',
        radius: [50, 200], // 缩小内外半径
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 40, name: 'rose 1' },
          { value: 38, name: 'rose 2' },
          { value: 32, name: 'rose 3' },
          { value: 30, name: 'rose 4' },
          { value: 28, name: 'rose 5' },
          { value: 26, name: 'rose 6' },
          { value: 22, name: 'rose 7' },
          { value: 18, name: 'rose 8' },
        ],
      },
    ],
  }
  useEffect(() => {
    const resizeCityChart = () => {
      const instance = EChartsUtils.getInstance(cityRef)
      if (instance) {
        instance.setOption(cityOption)
        instance.resize()
      }
    }
    const resizeAgeChart = () => {
      const instance = EChartsUtils.getInstance(ageRef)
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
      EChartsUtils.destroy(cityRef, ageRef)
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
