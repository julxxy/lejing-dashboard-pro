import { useEffect, useRef, useState } from 'react'
import styles from '@/views/dashboard/index.module.less'
import { Button, Card } from 'antd'
import { EChartsManager } from '@/context/EChartsManager.ts'
import { ReloadOutlined } from '@ant-design/icons'
import { isDebugEnable, log } from '@/common/Logger.ts'
import api from '@/api'
import { debounce } from 'lodash'

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
  const ageRef = useRef<HTMLDivElement>(null)
  const visitRef = useRef<HTMLDivElement>(null)
  const orderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchAndRenderData().then(() => setLoading(false)) // 页面挂载后渲染1次数据

    // 仅调整图表大小 + 300 毫秒防抖
    const resizeChart = debounce(() => {
      EChartsManager.resizeCharts(cityRef, ageRef, visitRef, orderRef)
    }, 300)

    addEventListener('resize', resizeChart) // 监听窗口大小变化

    // 组件卸载时销毁图表实例
    return () => {
      EChartsManager.destroy(cityRef, ageRef, visitRef, orderRef)
      removeEventListener('resize', resizeChart)
    }
  }, [])

  async function fetchAndRenderData() {
    if (isDebugEnable) log.debug('Fetching and rendering chart data')
    await renderCityChart()
    await renderAgeChart()
    renderVisitChart()
    orderCompletionRateRadarChart()
  }

  const renderCityChart = async () => {
    const data = await api.getDriverCityData()
    const instance = EChartsManager.getInstanceIfPresent(cityRef)
    instance?.setOption({
      title: { text: '司机城市分布', left: 'center' },
      legend: { orient: 'vertical', left: '8px' },
      toolbox: {
        feature: {
          ...EChartsManager.getEChartsOptionWithRefresh(() => {
            if (isDebugEnable) log.info(`Refreshing chart`)
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
    const data = await api.getDriverAgeData()
    const instance = EChartsManager.getInstanceIfPresent(ageRef)
    instance?.setOption({
      title: { text: '司机年龄分布', left: 'center' },
      legend: { orient: 'vertical', left: '8px' },
      toolbox: {
        feature: {
          ...EChartsManager.getEChartsOptionWithRefresh(() => {
            if (isDebugEnable) log.info(`Refreshing chart`)
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
    const instance = EChartsManager.getInstanceIfPresent(visitRef)
    instance?.setOption({
      title: { text: '用户访问来源', subtext: '', left: 'center' },
      tooltip: { trigger: 'item' },
      toolbox: {
        feature: {
          ...EChartsManager.getEChartsOptionWithRefresh(() => {
            if (isDebugEnable) log.info(`Refreshing chart`)
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
    const instance = EChartsManager.getInstanceIfPresent(orderRef)
    instance?.setOption({
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
    fetchAndRenderData().then(() => setTimeout(() => setLoading(false), 500))
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
          <div ref={visitRef} className={styles.pieItem} />
          <div ref={orderRef} className={styles.pieItem} />
        </div>
      </Card>
    </div>
  )
}
