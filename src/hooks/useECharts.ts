import { RefObject, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

/**
 * Hook of ECharts
 */
export default function useECharts(): [RefObject<HTMLDivElement | null>, echarts.EChartsType | undefined] {
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartInstance, setChartInstance] = useState<echarts.EChartsType>()

  useEffect(() => {
    if (!chartRef.current) return
    let instance = echarts.getInstanceByDom(chartRef.current)
    if (!instance) {
      instance = echarts.init(chartRef.current)
    }
    setChartInstance(instance)
  }, [])

  return [chartRef, chartInstance]
}
