import React, { useEffect, useRef, useState } from 'react'
import styles from '@/views/dashboard/index.module.less'
import { Button, Card } from 'antd'
import { EChartsManager } from '@/context/EChartsManager.ts'
import { ReloadOutlined } from '@ant-design/icons'
import { log } from '@/common/loggerProvider.ts'
import * as echarts from 'echarts'
import api from '@/api'
import { isDebugEnable } from '@/common/debugProvider.ts'

const OrderTransactionChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const resizeChart = () => fetchAndRenderOrderChart()
    const animationFrameId = requestAnimationFrame(resizeChart) // To prevent flickering
    window.addEventListener('resize', resizeChart) // Listen for window size changes
    return () => {
      cancelAnimationFrame(animationFrameId) // Clean up the animation frame
      EChartsManager.destroy(chartRef) // Destroy the chart instance when component unmounts
      window.removeEventListener('resize', resizeChart) // Remove the resize event listener
    }
  }, [])

  // Update the chart with new options
  async function fetchAndRenderOrderChart() {
    const [data] = await Promise.all([api.getOrderChartData()])
    EChartsManager.getInstanceIfNotPresent(chartRef)?.setOption({
      color: ['#80FFA5', '#00DDFF'],
      title: { text: `${new Date().getFullYear()}`, left: 'right' },
      legend: {},
      tooltip: {
        trigger: 'axis',

        formatter: (params: any) => {
          return params
            .map((item: { seriesName: any; value: any }) => {
              const { seriesName, value } = item
              let unit = ''
              if (seriesName === '订单数量') unit = '单'
              if (seriesName === '交易金额') unit = '元'
              return `${seriesName}: ${value} ${unit}`
            })
            .join('<br/>')
        },
      },
      xAxis: {
        type: 'category',
        data: data?.label,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '订单数量',
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(128, 255, 165)',
              },
              {
                offset: 1,
                color: 'rgb(1, 191, 236)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: data?.order,
        },
        {
          name: '交易金额',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(0, 221, 255)',
              },
              {
                offset: 1,
                color: 'rgb(77, 119, 255)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: data?.money,
        },
      ],
    })
  }

  function onReload() {
    if (isDebugEnable) log.info('Reloading chart data')
    setLoading(true)
    setTimeout(() => fetchAndRenderOrderChart().then(() => setLoading(false)), 1000)
  }

  return (
    <div className={styles.chart}>
      <Card
        title={<span>交易趋势</span>}
        extra={
          <Button
            icon={<ReloadOutlined />}
            shape={'circle'}
            loading={loading}
            size={'large'}
            color={'primary'}
            variant={'text'}
            onClick={onReload}
          />
        }
      >
        <div id="lineChart" ref={chartRef} className={styles.itemLine} />
      </Card>
    </div>
  )
}

export default OrderTransactionChart
