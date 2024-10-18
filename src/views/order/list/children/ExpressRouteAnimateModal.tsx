import { Button, Modal, Space } from 'antd'
import { CloseCircleOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { convertCityNameToGeoPoint, getMapInstance, mapConstants } from '@/context/BaiduMapProvider.ts'
import { useEffect, useImperativeHandle, useState } from 'react'
import { Order } from '@/types/apiType.ts'
import { Action, IModalProps } from '@/types/modal.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'
import '@/views/order/list/index.mudule.less'
import { message } from '@/context/AntdGlobalProvider.ts'

/*
 * 货运物流驶路线详情
 */
export default function ExpressRouteAnimateModal({ parentRef, onRefresh }: IModalProps) {
  const [showModal, setShowModal] = useState(false)
  const [centerPoint, setCenterPoint] = useState<{ lng: string; lat: string }>()
  const [trackAni, setTrackAni] = useState<any>(null)
  const [order, setOrder] = useState<Order.OrderDetail | null>(null)
  const [isPaused, setIsPaused] = useState(false) // 跟踪暂停状态

  useImperativeHandle(parentRef, () => controller)

  const controller = {
    openModal: (action: Action, data: Order.OrderDetail) => {
      if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, data)
      setOrder(null)
      setCenterPoint(undefined)
      setTrackAni(null)
      setIsPaused(false) // 打开模态时重置暂停状态
      setShowModal(true)
      if (data?.route.length === 0) {
        setShowModal(false)
        message.info('请先完成打点上报')
        return
      }
      setOrder(data)
      convertCityNameToGeoPoint(data.cityName, point => setCenterPoint(point))
    },
    closeModal: () => {
      setShowModal(false)
      trackAni?.cancel()
      onRefresh()
    },
  }

  const initializeTrackAnimation = (map: any, route: any[]) => {
    const points = route.map(item => new BMapGL.Point(item.lng, item.lat))

    // 创建卡车司机图标
    const icon = new BMapGL.Icon(mapConstants.iconRoutAnimate, new BMapGL.Size(32, 32), {
      imageSize: new BMapGL.Size(32, 32),
      anchor: new BMapGL.Size(16, 16),
    })

    // 使用卡车图标创建标记
    const truckMarker = new BMapGL.Marker(points[0], { icon: icon })
    map.addOverlay(truckMarker)

    // 绘制路线的折线
    const polyline = new BMapGL.Polyline(points, { strokeColor: '#58e817', strokeWeight: 5, strokeOpacity: 0.8 })
    map.addOverlay(polyline)

    // 初始化轨迹动画
    const animation = new BMapGLLib.TrackAnimation(map, polyline, {
      overallView: true,
      tilt: 30,
      duration: 20000,
      delay: 150,
    })

    setTrackAni(animation)

    // 开始动画
    animation.start()

    // 使用 setInterval 沿折线移动标记
    let currentIndex = 0
    const totalPoints = points.length
    const intervalTime = 20000 / totalPoints // 与动画持续时间同步

    const moveMarkerInterval = setInterval(() => {
      if (currentIndex < totalPoints) {
        truckMarker.setPosition(points[currentIndex])
        currentIndex++
      } else {
        clearInterval(moveMarkerInterval)
      }
    }, intervalTime)
  }

  // 初始化地图
  useEffect(() => {
    if (centerPoint && order?.route) {
      const map = getMapInstance(centerPoint, 'driverSRouteContainer', 16)
      initializeTrackAnimation(map, order.route)
    }
  }, [centerPoint, order])

  // 暂停/继续动画
  const handleAni = () => {
    if (!trackAni) return
    setIsPaused(!isPaused) // Update pause state
    if (isPaused) trackAni.continue()
    else trackAni.pause()
  }

  return (
    <Modal
      title="物流轨迹详情"
      width="68%"
      height="60%"
      open={showModal}
      cancelButtonProps={{ icon: <CloseCircleOutlined /> }}
      onCancel={controller.closeModal}
      footer={null}
    >
      <div id="driverSRouteContainer" className="mapContainer" />
      <Space>
        <Button icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />} onClick={handleAni}>
          {isPaused ? '继续' : '暂停'}
        </Button>
      </Space>
    </Modal>
  )
}
