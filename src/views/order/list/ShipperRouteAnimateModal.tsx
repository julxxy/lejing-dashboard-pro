import { Action, IModalProps } from '@/types/modal.ts'
import { useImperativeHandle, useState } from 'react'
import { Order } from '@/types/apiType.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { Modal } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

export default function ShipperRouteAnimateModal({ currentRef, onRefresh }: IModalProps) {
  // Constants
  const [showModal, setShowModal] = useState(false)

  // Expose methods to parent component
  useImperativeHandle(currentRef, () => controller)

  const controller = {
    openModal: (action: Action, data: Order.OrderDetail) => {
      if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, data)
      setShowModal(true)
    },
    closeModal: () => {
      onRefresh()
      setShowModal(false)
    },
  }

  function handleSubmit() {
    controller.closeModal()
  }

  return (
    <Modal
      title="司机行驶路线"
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
