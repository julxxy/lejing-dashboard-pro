import { Action, IModalProps } from '@/types/modal.ts'
import { Modal } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Order } from '@/types/apiType.ts'
import api from '@/api'
import { message } from '@/context/AntdGlobalProvider.ts'

// Custom delete button HTML
const deleteButtonHTML = `
  <div style="
    color: #fff;
    background-color: #ff4d4f;
    padding: 5px 10px;
    border-radius: 5px;
    text-align:center;
    cursor: pointer;
    font-size: 14px;
  ">
    删除？
  </div>
`

/**
 * 货运人员行驶轨迹：使用可点击标记显示驾驶员路线的模式
 */
export default function ShipperRouteCreateModal({ currentRef, onRefresh }: IModalProps) {
  // Constants
  const driverIcon = '/images/icon_driver_128.png'
  const [showModal, setShowModal] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
  const [centerPoint, setCenterPoint] = useState<{ lng: string; lat: string } | undefined>()
  const [marks, setMarks] = useState<{ lng: string; lat: string; id: string }[]>([])

  // Expose methods to parent component
  useImperativeHandle(currentRef, () => controller)

  const controller = {
    openModal: (action: Action, data: Order.OrderDetail) => {
      if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, data)
      setShowModal(true)
      if (data) {
        setOrderId(data.orderId)
        convertCityToGeoPoint(data.cityName)
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
      onRefresh()
      setShowModal(false)
    },
  }

  // Convert city name to geo point
  const convertCityToGeoPoint = (cityName: string) => {
    const geocoder = new window.BMapGL.Geocoder()
    geocoder.getPoint(
      cityName,
      (point: { lng: string; lat: string }) => {
        if (point) {
          setCenterPoint(point)
          log.info(`Geocoded city: ${cityName}, Point:`, point)
        } else {
          log.error('Failed to geocode city name')
        }
      },
      cityName
    )
  }

  // Get map instance
  const getMapInstance = (center: { lng: string; lat: string }) => {
    const map = new window.BMapGL.Map('bmContainer')
    const point = new window.BMapGL.Point(center.lng, center.lat)
    map.centerAndZoom(point, 12)
    map.addControl(new window.BMapGL.ScaleControl())
    map.addControl(new window.BMapGL.ZoomControl())
    map.addControl(new window.BMapGL.CityListControl())
    map.enableScrollWheelZoom(true)
    return map
  }

  // Create and add marker
  const createMarker = (map: any, lng: string, lat: string, id: string) => {
    const point = new window.BMapGL.Point(lng, lat)
    const icon = new window.BMapGL.Icon(driverIcon, new window.BMapGL.Size(32, 32), {
      imageSize: new window.BMapGL.Size(32, 32),
      anchor: new window.BMapGL.Size(16, 16),
    })

    const marker = new window.BMapGL.Marker(point, { icon })
    marker.id = id

    // Add delete menu
    const markerMenu = new window.BMapGL.ContextMenu()
    markerMenu.addItem(
      new window.BMapGL.MenuItem(deleteButtonHTML, () => {
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
    const map = getMapInstance(center)
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
  }

  // Effect to render map when centerPoint changes
  useEffect(() => {
    if (centerPoint) {
      renderMap(centerPoint)
    }
  }, [centerPoint])

  return (
    <Modal
      title="行驶路线打点"
      width="70%"
      height="60%"
      open={showModal}
      onOk={handleSubmit}
      okButtonProps={{ icon: <CheckCircleOutlined /> }}
      cancelButtonProps={{ icon: <CloseCircleOutlined /> }}
      onCancel={controller.closeModal}
    >
      <div
        id="bmContainer"
        style={{
          padding: '20px',
          height: '600px',
          borderRadius: 'var(--border-radius-default)',
          border: 'var(--border-default)',
        }}
      />
    </Modal>
  )
}
