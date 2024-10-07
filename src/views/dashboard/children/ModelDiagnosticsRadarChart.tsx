import React, { useEffect, useRef, useState } from 'react'
import styles from '@/views/dashboard/index.module.less'
import { Button, Card } from 'antd'
import { EChartsManager } from '@/context/EChartsManager.ts'
import { ReloadOutlined } from '@ant-design/icons'
import { log } from '@/common/loggerProvider.ts'

const ModelDiagnosticsRadarChart: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const budgetSpendingRef = useRef<HTMLDivElement>(null)
  const driverModelRef = useRef<HTMLDivElement>(null)
  const driverOption = {
    title: { text: '', left: 'right' },
    legend: { orient: 'vertical', left: 'right', data: ['司机模型诊断'] },
    radar: {
      indicator: [
        { name: '服务态度', max: 10 },
        { name: '服务时长', max: 600 },
        { name: '接单率', max: 100 },
        { name: '关注度', max: 10000 },
        { name: '评分', max: 5 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [9, 500, 98, 6000, 4],
            name: '司机模型诊断',
          },
        ],
      },
    ],
  }

  const budgetSpendingOption = {
    title: {
      text: '成本支出分析',
      left: 'center',
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      data: ['预算成本', '实际支出'],
    },
    radar: {
      shape: 'circle',
      indicator: [
        { name: '销售', max: 6500 },
        { name: '管理', max: 16000 },
        { name: '信息技术', max: 30000 },
        { name: '客户支持', max: 38000 },
        { name: '研发', max: 52000 },
        { name: '营销', max: 25000 },
      ],
    },
    series: [
      {
        name: '预算 vs 开支',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: '预算成本',
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '实际支出',
          },
        ],
      },
    ],
  }

  useEffect(() => {
    const resizeChart = () => {
      const instance = EChartsManager.getInstanceIfNotPresent(budgetSpendingRef)
      const driverModelInstance = EChartsManager.getInstanceIfNotPresent(driverModelRef)
      if (instance) {
        instance.setOption(budgetSpendingOption)
        instance.resize()
      }
      if (driverModelInstance) {
        driverModelInstance.setOption(driverOption)
        driverModelInstance.resize()
      }
    }
    const animationFrameId = requestAnimationFrame(resizeChart)

    return () => {
      cancelAnimationFrame(animationFrameId)
      EChartsManager.destroy(budgetSpendingRef, driverModelRef)
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
        <div className={styles.radarContainer}>
          <div id="budgetSpendingRadarChart" ref={budgetSpendingRef} className={styles.radarIem} />
          <div id="driverModelRaderRef" ref={driverModelRef} className={styles.radarIem} />
        </div>
      </Card>
    </div>
  )
}

export default ModelDiagnosticsRadarChart
