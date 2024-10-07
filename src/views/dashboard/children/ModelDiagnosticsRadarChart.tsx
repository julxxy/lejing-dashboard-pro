import React, { useEffect, useRef, useState } from 'react'
import styles from '@/views/dashboard/index.module.less'
import { Button, Card } from 'antd'
import { EChartsManager } from '@/context/EChartsManager.ts'
import { ReloadOutlined } from '@ant-design/icons'
import { log } from '@/common/loggerProvider.ts'
import { isDebugEnable } from '@/common/debugProvider.ts'
import api from '@/api'

const ModelDiagnosticsRadarChart: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const budgetSpendingRef = useRef<HTMLDivElement>(null)
  const driverModelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resizeChart = () => {
      renderDriverModelChart()
      renderBudgetSpending()
    }

    window.addEventListener('resize', resizeChart)
    resizeChart() // Initial resize after rendering

    return () => {
      window.removeEventListener('resize', resizeChart)
      EChartsManager.destroy(budgetSpendingRef, driverModelRef)
    }
  }, [])

  function onReloadClicked() {
    if (isDebugEnable) log.info('Reloading chart data')
    setLoading(!loading)
    renderDriverModelChart().then(() => setTimeout(() => setLoading(false), 1500))
  }

  // Render driver model radar chart
  const renderDriverModelChart = async () => {
    const [{ indicator, data }] = await Promise.all([api.getDriverRadarData()])
    EChartsManager.getInstanceIfNotPresent(driverModelRef)?.setOption({
      title: { text: '', left: 'right' },
      legend: { orient: 'vertical', left: '8px', data: ['司机模型诊断'] },
      toolTip: {},
      toolbox: {
        feature: {
          ...EChartsManager.getEChartsOptionWithRefresh(() => {
            if (isDebugEnable) log.info(`Refreshing '用户访问来源' chart`)
            renderDriverModelChart()
          }),
        },
      },
      radar: {
        indicator,
      },
      series: [
        {
          type: 'radar',
          data,
        },
      ],
    })
  }

  // Render budget spending radar chart
  const renderBudgetSpending = async () => {
    EChartsManager.getInstanceIfNotPresent(budgetSpendingRef)?.setOption({
      title: { text: '成本支出分析', left: 'center' },
      legend: { orient: 'vertical', left: '8px', data: ['预算成本', '实际支出'] },
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
    })
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
          <div ref={budgetSpendingRef} className={styles.radarIem} />
          <div ref={driverModelRef} className={styles.radarIem} />
        </div>
      </Card>
    </div>
  )
}

export default ModelDiagnosticsRadarChart
