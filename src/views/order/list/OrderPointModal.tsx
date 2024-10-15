import { Action, IModalProps } from '@/types/modal.ts'
import { Modal } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Order } from '@/types/apiType.ts'
import api from '@/api'
import { message } from '@/context/AntdGlobalProvider.ts'

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
 * 百度地图打点：货运人员行驶轨迹
 */
export default function OrderPointModal({ currentRef, onRefresh }: IModalProps) {
  // Constants
  const driverIcon = '/images/icon_driver_128.png'
  const [showModal, setShowModal] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
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
        const restoredMarks = data?.route?.map((item, index) => ({ lng: item.lng, lat: item.lat, id: `${index}` }))
        setMarks(restoredMarks)
      }
    },
    closeModal: () => {
      setMarks([])
      onRefresh()
      setShowModal(false)
    },
  }

  // 将城市名称地理编码为地理点
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
      cityName,
    )
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
    const icon = new window.BMapGL.Icon(driverIcon, new window.BMapGL.Size(32, 32), {
      imageSize: new window.BMapGL.Size(32, 32),
      anchor: new window.BMapGL.Size(16, 16),
    })

    const marker = new window.BMapGL.Marker(point, { icon }) // 创建标注对象
    marker.id = id // 给标注对象添加 id 属性

    // 创建右键菜单
    const markerMenu = new window.BMapGL.ContextMenu()
    markerMenu.addItem(
      new window.BMapGL.MenuItem(deleteButtonHTML, () => {
        if (isDebugEnable) log.info('Marker menu clicked before: ', marker.id, marks)
        setMarks(prevMarkers => prevMarkers.filter(item => item.id !== marker.id))
        map.removeOverlay(marker)
        if (isDebugEnable) log.info('Marker menu clicked after: ', marker.id, marks)
      }),
    )

    marker.addContextMenu(markerMenu) // 绑定右键菜单
    map.addOverlay(marker)
  }

  // 恢复标注
  const restoreMarkerIfPresent = (map: any, marks: { lng: string; lat: string; id: string }[]) => {
    if (map && marks) {
      marks.forEach(marker => {
        createMarker(map, marker.lng, marker.lat, marker.id)
      })
    }
  }

  // 渲染地图
  function renderMap(center: { lng: string; lat: string }) {
    if (!center) {
      log.error('Center point is not available')
      return
    }
    const map = getMapInstance(center)
    restoreMarkerIfPresent(map, marks)
    map.addEventListener('click', (event: any) => {
      const { latlng, timeStamp } = event
      const { lng, lat } = latlng
      const id = `${lng}|${lat}|${timeStamp}`
      createMarker(map, lng, lat, id)
      setMarks(prevMarkers => [...prevMarkers, { lng, lat, id }])
    })
  }

  // Handle OK button click event
  async function handleSubmit() {
    await api.order.update({ orderId, route: marks })
    message.success('保存成功')
    controller.closeModal()
  }

  // 监听 centerPoint 变化，渲染地图
  useEffect(() => {
    if (centerPoint) {
      renderMap(centerPoint)
    }
  }, [centerPoint])

  return (
    <Modal
      title="司机行驶轨迹"
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
          border: '1px solid var()',
        }}
      />
    </Modal>
  )
}
