import { useEffect, useRef, useState } from 'react'
import styles from '@/views/dashboard/index.module.less'
import { Button, Card } from 'antd'
import { EChartsManager } from '@/context/EChartsManager.ts'
import { ReloadOutlined } from '@ant-design/icons'
import { debugEnable, log } from '@/common/loggerProvider.ts'
import api from '@/api'

const generateNewVisitData = () => {
  return [
    { value: Math.random() * 500, name: '直接访问' },
    { value: Math.random() * 500, name: '邮件营销' },
    { value: Math.random() * 500, name: '联盟广告' },
    { value: Math.random() * 500, name: '视频广告' },
    { value: Math.random() * 1500, name: '搜索引擎' },
  ]
}

export default function BusinessOverviewPieChart() {
  const [loading, setLoading] = useState(false)

  const cityRef = useRef<HTMLDivElement>(null)
  const visitSourceRef = useRef<HTMLDivElement>(null)
  const ageRef = useRef<HTMLDivElement>(null)
  const orderCompletionRateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resizeChart = () => {
      renderCityChart()
      renderAgeChart()
      renderVisitChart()
      orderCompletionRateRadarChart()
    }
    // 防止闪烁
    const cityAnimationFrameId = requestAnimationFrame(resizeChart)
    // 监听窗口大小变化
    addEventListener('resize', resizeChart)
    // 防止内存泄露
    return () => {
      cancelAnimationFrame(cityAnimationFrameId)
      EChartsManager.destroy(cityRef, ageRef)
      removeEventListener('resize', resizeChart)
    }
  }, [])

  async function fetchAndRenderData() {
    if (debugEnable) log.debug('Fetching and rendering chart data')
    await renderCityChart()
    await renderAgeChart()
    renderVisitChart()
    orderCompletionRateRadarChart()
  }

  //  渲染数据
  const renderCityChart = async () => {
    const [data] = await Promise.all([api.getDriverCityData()])
    EChartsManager.getInstanceIfPresent(cityRef)?.setOption({
      title: { text: '司机城市分布', left: 'center' },
      legend: { orient: 'vertical', left: '8px' },
      toolbox: {
        feature: {
          ...EChartsManager.getEChartsOptionWithRefresh(() => {
            if (debugEnable) log.info(`Refreshing chart`)
            renderCityChart()
          }),
        },
      },
      series: [
        {
          name: '城市',
          type: 'pie',
          radius: [50, 130],
          itemStyle: {
            borderRadius: 8,
          },
          data,
        },
      ],
    })
  }
  const renderAgeChart = async () => {
    const [data] = await Promise.all([api.getDriverAgeData()])
    EChartsManager.getInstanceIfPresent(ageRef)?.setOption({
      title: { text: '司机年龄分布', left: 'center' },
      legend: { orient: 'vertical', left: '8px' },
      toolbox: {
        feature: {
          ...EChartsManager.getEChartsOptionWithRefresh(() => {
            if (debugEnable) log.info(`Refreshing chart`)
            renderAgeChart()
          }),
        },
      },
      series: [
        {
          name: '年龄',
          type: 'pie',
          radius: [50, 130],
          roseType: 'radius',
          itemStyle: {
            borderRadius: 8,
          },
          data,
        },
      ],
    })
  }
  const renderVisitChart = () => {
    const data = generateNewVisitData()
    EChartsManager.getInstanceIfPresent(visitSourceRef)?.setOption({
      title: { text: '用户访问来源', subtext: '', left: 'center' },
      tooltip: { trigger: 'item' },
      toolbox: {
        feature: {
          ...EChartsManager.getEChartsOptionWithRefresh(() => {
            if (debugEnable) log.info(`Refreshing chart`)
            renderVisitChart()
          }),
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '60%',
          data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    })
  }

  const orderCompletionRateRadarChart = () => {
    EChartsManager.getInstanceIfPresent(orderCompletionRateRef)?.setOption({
      title: { text: '订单完成率分析', left: 'center' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['完成率'], left: '8px' },
      xAxis: { type: 'category', data: ['北京', '上海', '广州', '深圳', '杭州', '武汉'] },
      yAxis: { type: 'value', axisLabel: { formatter: '{value} %' } },
      series: [
        {
          name: '完成率',
          type: 'bar',
          data: [92, 88, 85, 90, 87, 94], // 假设完成率数据
          itemStyle: {
            color: '#5470C6', // 自定义颜色
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c} %',
          },
        },
      ],
    })
  }

  function onReloadClicked() {
    setLoading(!loading)
    fetchAndRenderData().then(() => setTimeout(() => setLoading(false), 1500))
  }

  return (
    <div className={styles.chart}>
      <Card
        className={styles.chart}
        title="业务数据概览"
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
        <div className={styles.pieContainer}>
          <div ref={visitSourceRef} className={styles.pieItem} />
          <div ref={orderCompletionRateRef} className={styles.pieItem} />
        </div>
      </Card>
    </div>
  )
}
