import { Action, IModalProps } from '@/types/modal.ts'
import { useImperativeHandle, useState } from 'react'
import { Order } from '@/types'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { Descriptions, DescriptionsProps, Modal } from 'antd'
import api from '@/api'
import { formatDateToLocalString, formatOrderStatus } from '@/utils'

/**
 * 订单详情页
 */
export default function OrderDetailModal({ parentRef }: IModalProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [items, setItems] = useState<DescriptionsProps['items']>([])

  // Expose methods to parent component
  useImperativeHandle(parentRef, () => controller)
  // Controller for exposing modal actions to the parent component
  const controller = {
    openModal: (action: Action, data?: Order.OrderDetail | string) => {
      if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, data)
      setModalOpen(true)
      if (typeof data === 'string') {
        api.order.getOrderDetail(data).then(res => {
          const orderItems = convertOrderDetailToDescriptions(res)
          setItems(orderItems)
        })
      }
    },
    closeModal: () => setModalOpen(false),
  }

  // Mask the mobile number
  const maskMobile = (mobile: string) => {
    return mobile ? mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''
  }
  // Generate the items for Descriptions component
  const convertOrderDetailToDescriptions = (order: Order.OrderDetail): DescriptionsProps['items'] => {
    return [
      { label: '用户名', children: order.userName },
      { label: '手机号', children: maskMobile(order.mobile.toString()) },
      { label: '城市名称', children: order.cityName },
      { label: '起始地址', children: order.startAddress },
      { label: '结束地址', children: order.endAddress },
      { label: '订单金额', children: `${order.orderAmount} 元` },
      { label: '用户支付金额', children: `${order.userPayAmount} 元` },
      { label: '司机金额', children: `${order.driverAmount} 元` },
      { label: '支付方式', children: order.payType === 1 ? '微信' : '支付宝' },
      { label: '订单状态', children: formatOrderStatus(order.state) },
      { label: '用车时间', children: formatDateToLocalString(order.useTime as string) },
      { label: '订单结束时间', children: formatDateToLocalString(order.endTime as string) },
    ]
  }

  return (
    <Modal title="订单详情" open={modalOpen} onCancel={controller.closeModal} footer={null} width="60%">
      <Descriptions bordered column={2} items={items} style={{ marginTop: 20, padding: '10px' }} />
    </Modal>
  )
}
