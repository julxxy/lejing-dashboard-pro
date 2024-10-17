import { Select, SelectProps } from 'antd'
import styles from '@/views/order/insights/index.module.less'
import { useCallback, useEffect, useState } from 'react'
import { Point } from '@/types/apiType.ts'
import { convertCityNameToGeoPoint, getMapInstance, mapConstants } from '@/context/BaiduMapProvider.ts'
import api from '@/api'
import { debounce } from 'lodash'

// 城市列表
const cities: SelectProps['options'] = [
  { label: '杭州', value: '30001' },
  { label: '武汉', value: '20001' },
  { label: '昆明', value: '50001' },
  { label: '长沙', value: '10001' },
  { label: '惠州', value: '40001' },
]
const containerId = 'heatMapContainer'

/**
 * 订单洞察热力地图
 */
export default function OrderInsightsPro() {
  const [city, setCity] = useState<{ label: string; value: string }>({
    label: '长沙',
    value: '10001',
  })
  const [loading, setLoading] = useState(false)
  const [center, setCenter] = useState<Point>()
  const [points, setPoints] = useState<Point[]>([])

  // 获取城市热力图数据
  const fetchPoints = useCallback(
    debounce(async (cityValue: string) => {
      setLoading(!loading)
      const res = await api.order.getCityHeatMapPoints(cityValue)
      setPoints(res)
    }, 300),
    []
  )

  // 城市名变换更新中心点经纬度
  useEffect(() => {
    convertCityNameToGeoPoint(city.label, point => setCenter(point))
  }, [city.label])

  // 切割点集并渲染地图： 每批 100 个点的数据逐帧渲染在地图上，避免一次性处理大量数据导致性能问题
  const renderMap = useCallback(() => {
    if (!center || points.length === 0) return

    const map = getMapInstance(center, containerId, 12)
    if (!map) return

    const markers: any[] = []

    const BATCH_SIZE = 100
    let currentBatch = 0

    const processBatch = () => {
      const startIndex = currentBatch * BATCH_SIZE
      const endIndex = startIndex + BATCH_SIZE
      const batchPoints = points.slice(startIndex, endIndex)

      batchPoints.forEach(({ lng, lat }) => {
        const point = new BMapGL.Point(lng, lat)
        const icon = new BMapGL.Icon(mapConstants.iconRoutAnimate, new BMapGL.Size(32, 32), {
          imageSize: new BMapGL.Size(32, 32),
          anchor: new BMapGL.Size(16, 16),
        })
        const marker = new BMapGL.Marker(point, { icon })
        markers.push(marker)
      })

      currentBatch++
      if (startIndex < points.length) {
        requestAnimationFrame(processBatch) // 确保渲染不阻塞主线程，直到每批次数据完成
      } else {
        if (markers.length > 0) {
          new BMapLib.MarkerClusterer(map, { markers })
          setTimeout(() => setLoading(!loading), 500)
        }
      }
    }

    processBatch()
  }, [center, points])

  // 当中心发生变化时获取点并渲染地图
  useEffect(() => {
    if (center) {
      fetchPoints(city.value)
    }
  }, [center, city.value, fetchPoints])

  // 仅当点更新时渲染贴图
  useEffect(() => {
    if (points.length > 0) {
      renderMap()
    }
  }, [points, renderMap])

  const handleChange = (value: string) => {
    const selectedCity = cities!.find(city => city.value === value)
    if (selectedCity) {
      const label = selectedCity.label as string
      setCity({ label, value })
    }
  }

  return (
    <div className={styles.mapAggrContainer}>
      <Select
        className={styles.selectTitle}
        placeholder="请选择城市"
        onChange={handleChange}
        options={cities}
        loading={loading}
        variant="borderless"
        defaultValue={city.value}
      />
      <div id={containerId} className={styles.heatMapContainer}></div>
    </div>
  )
}
