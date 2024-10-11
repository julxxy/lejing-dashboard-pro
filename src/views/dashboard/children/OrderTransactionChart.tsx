import { useEffect, useRef, useState } from 'react'
import styles from '@/views/dashboard/index.module.less'
import { Button, Card } from 'antd'
import { EChartsManager } from '@/context/EChartsManager.ts'
import { ReloadOutlined } from '@ant-design/icons'
import { isDebugEnable, log } from '@/common/Logger.ts'
import * as echarts from 'echarts'
import api from '@/api'
import { debounce } from 'lodash'

export default function OrderTransactionChart() {
  const [loading, setLoading] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 页面挂载后渲染1次数据
    fetchAndRenderOrderChart().then(() => setLoading(false))

    // 仅调整图表大小 + 300 毫秒防抖
    const resizeChart = debounce(() => {
      EChartsManager.resizeCharts(chartRef)
    }, 300)

    window.addEventListener('resize', resizeChart) // 监听窗口大小变化

    return () => {
      EChartsManager.destroy(chartRef) // 组件卸载时销毁图表实例
      window.removeEventListener('resize', resizeChart) // 移除 resize 事件监听器
    }
  }, [])

  // Update the chart with new options
  async function fetchAndRenderOrderChart() {
    const data = await api.getOrderChartData()
    const instance = EChartsManager.getInstanceIfPresent(chartRef)
    instance?.resize()
    instance?.setOption({
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

    return instance
  }

  function onReload() {
    if (isDebugEnable) log.info('Reloading chart data')
    setLoading(true)
    setTimeout(() => fetchAndRenderOrderChart().then(() => setLoading(false)), 500)
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
