import { Action, IModalProps } from '@/types/modal.ts'
import { Modal } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Order } from '@/types'
import api from '@/api'
import { message } from '@/context/AntdGlobalProvider.ts'
import { convertCityNameToGeoPoint, getMapInstance, mapConstants } from '@/context/BaiduMapProvider.ts'
import '@/views/order/list/index.mudule.less'

// Delete button HTML
const deleteButtonHTML = `<div class="mapDeleteButton">删除 ?</div>`

/**
 * 地图打点上报货运人员行驶轨迹：使用可点击标记显示驾驶员行驶的地图路线
 */
export default function ExpressRouteReportModal({ parentRef, onRefresh }: IModalProps) {
  // Constants
  const [showModal, setShowModal] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
  const [centerPoint, setCenterPoint] = useState<{ lng: string; lat: string } | undefined>()
  const [marks, setMarks] = useState<{ lng: string; lat: string; id: string }[]>([])

  // Expose methods to parent component
  useImperativeHandle(parentRef, () => controller)

  const controller = {
    openModal: (action: Action, data: Order.OrderDetail) => {
      if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, data)
      setShowModal(true)
      if (data) {
        setOrderId(data.orderId)
        convertCityNameToGeoPoint(data.cityName, point => setCenterPoint(point))
        const restoredMarks = data.route?.map((item, index) => ({
          lng: item.lng,
          lat: item.lat,
          id: `${index}`,
        }))
        setMarks(restoredMarks || [])
      }
    },
    closeModal: () => {
      setMarks([])
      setShowModal(false)
    },
  }

  // Create and add marker
  const createMarker = (map: any, lng: string, lat: string, id: string) => {
    const point = new BMapGL.Point(lng, lat)
    const icon = new BMapGL.Icon(mapConstants.iconMarkPoint, new BMapGL.Size(32, 32), {
      imageSize: new BMapGL.Size(32, 32),
      anchor: new BMapGL.Size(16, 16),
    })

    const marker = new BMapGL.Marker(point, { icon })
    marker.id = id

    // Add delete menu
    const markerMenu = new BMapGL.ContextMenu()
    markerMenu.addItem(
      new BMapGL.MenuItem(deleteButtonHTML, () => {
        if (isDebugEnable) log.info('Marker menu clicked before: ', marker.id, marks)
        setMarks(prevMarks => prevMarks.filter(item => item.id !== marker.id))
        map.removeOverlay(marker)
        if (isDebugEnable) log.info('Marker menu clicked after: ', marker.id, marks)
      })
    )

    marker.addContextMenu(markerMenu)
    map.addOverlay(marker)
  }

  // Restore markers
  const restoreMarkers = (map: any) => {
    marks.forEach(marker => {
      createMarker(map, marker.lng, marker.lat, marker.id)
    })
  }

  // Render map
  const renderMap = (center: { lng: string; lat: string }) => {
    if (!center) {
      log.error('Center point is not available')
      return
    }
    const map = getMapInstance(center, 'bmContainer', 12)
    restoreMarkers(map)
    map.addEventListener('click', (event: any) => {
      const { latlng, timeStamp } = event
      const { lng, lat } = latlng
      const id = `${lng}|${lat}|${timeStamp}`
      createMarker(map, lng, lat, id)
      setMarks(prevMarks => [...prevMarks, { lng, lat, id }])
    })
  }

  // Submit route data
  const handleSubmit = async () => {
    await api.order.update({ orderId, route: marks })
    message.success('保存成功')
    controller.closeModal()
    onRefresh()
  }

  // Effect to render map when centerPoint changes
  useEffect(() => {
    if (centerPoint) {
      renderMap(centerPoint)
    }
  }, [centerPoint])

  return (
    <Modal
      title="物流路线打点上报"
      width="68%"
      height="60%"
      open={showModal}
      onOk={handleSubmit}
      okButtonProps={{ icon: <CheckCircleOutlined />, type: 'primary' }}
      cancelButtonProps={{ icon: <CloseCircleOutlined /> }}
      onCancel={controller.closeModal}
    >
      <div id="bmContainer" className="mapContainer" />
    </Modal>
  )
}
