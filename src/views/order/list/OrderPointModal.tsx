import { Action, IModalProps } from '@/types/modal.ts'
import { Modal } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Order } from '@/types/apiType.ts'
import api from '@/api'
import { message } from '@/context/AntdGlobalProvider.ts'

/**
 * 百度地图打点：货运人员行驶轨迹
 */
export default function OrderPointModal({ currentRef }: IModalProps) {
  // Constants
  const driverIcon = '/images/icon_driver_128.png'
  const [showModal, setShowModal] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [centerPoint, setCenterPoint] = useState<{ lng: string; lat: string }>() // 中心点坐标
  const [marks, setMarks] = useState<{ lng: string; lat: string; id: string }[]>([]) // 标注点坐标

  // Expose methods to parent component
  useImperativeHandle(currentRef, () => controller)

  const controller = {
    openModal: (action: Action, data: Order.OrderDetail) => {
      if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, data)
      setShowModal(true)
      if (data) {
        setOrderId(data.orderId)
        convertCityToGeoPoint(data.cityName)
        const restoredMarkers = data?.route?.map((item, index) => ({ lng: item.lng, lat: item.lat, id: `${index}` }))
        setMarks(restoredMarkers)
      }
    },
    closeModal: () => setShowModal(false),
  }

  // Geocoding city name to geo point
  function convertCityToGeoPoint(cityName: string) {
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
      cityName,
    )
  }

  // Handle OK button click event
  async function handleSubmit() {
    setLoading(true)
    await api.order.update({ orderId, route: marks }).then(() => {
      if (isDebugEnable) log.info('Order map info saved successfully')
    })
    message.success('保存成功')
    controller.closeModal()
    setLoading(false)
  }

  // 获取地图实例
  const getMapInstance = (center: { lng: string; lat: string }) => {
    const instance = new window.BMapGL.Map('bmContainer')
    const point = new window.BMapGL.Point(center.lng, center.lat)
    instance.centerAndZoom(point, 12)
    instance.addControl(new window.BMapGL.ScaleControl()) // 添加比例尺控件
    instance.addControl(new window.BMapGL.ZoomControl()) // 添加缩放控件
    instance.addControl(new window.BMapGL.CityListControl()) // 添加城市列表控件
    instance.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    return instance
  }

  // 创建标注对象并添加到地图
  function createMarker(map: any, lng: string, lat: string, id: string) {
    const point = new window.BMapGL.Point(lng, lat)
    const icon = new window.BMapGL.Icon(
      driverIcon,
      new window.BMapGL.Size(32, 32), // 修改图标的大小
      {
        imageSize: new window.BMapGL.Size(32, 32), // 设置实际图标大小
        anchor: new window.BMapGL.Size(16, 16), // 设置图标的锚点
      },
    )

    const marker = new window.BMapGL.Marker(point, { icon }) // 创建标注对象
    marker.id = id // 给标注对象添加 id 属性

    const markerMenu = new window.BMapGL.ContextMenu() // 创建右键菜单
    markerMenu.addItem(
      new window.BMapGL.MenuItem('删除', () => {
        if (isDebugEnable) log.info('Marker menu clicked before: ', marker.id, marks)
        setMarks(prevMarkers => prevMarkers.filter(item => item.id !== marker.id))
        map.removeOverlay(marker)
        if (isDebugEnable) log.info('Marker menu clicked after: ', marks)
      }),
    )
    marker.addContextMenu(markerMenu) // 绑定右键菜单
    map.addOverlay(marker)
  }

  // 渲染地图
  function renderMap(center: { lng: string; lat: string }) {
    const map = getMapInstance(center)
    map.addEventListener('click', (event: any) => {
      const { latlng, timeStamp } = event
      const { lng, lat } = latlng
      const id = `${lng}|${lat}|${timeStamp}`
      createMarker(map, lng, lat, id)
      setMarks(prevMarkers => [...prevMarkers, { lng, lat, id }])
    })
  }

  // 恢复标注
  function restoreMarkers(marks: { lng: string; lat: string; id: string }[]) {
    if (centerPoint) {
      const map = getMapInstance(centerPoint)
      marks.forEach(marker => {
        createMarker(map, marker.lng, marker.lat, marker.id)
      })
    }
  }

  // 监听订单信息变化，更新地图信息
  useEffect(() => {
    if (orderId && centerPoint) {
      renderMap(centerPoint)
      restoreMarkers(marks)
    }
  }, [orderId, centerPoint])

  return (
    <Modal
      title="司机行驶轨迹"
      width="70%"
      height="60%"
      open={showModal}
      onOk={handleSubmit}
      okButtonProps={{ loading, icon: <CheckCircleOutlined /> }}
      cancelButtonProps={{ disabled: loading, icon: <CloseCircleOutlined /> }}
      onCancel={controller.closeModal}
    >
      <div
        id="bmContainer"
        style={{
          padding: '20px',
          height: '600px',
          borderRadius: 'var(--border-radius-default)',
          border: '1px solid var()',
        }}
      />
    </Modal>
  )
}
