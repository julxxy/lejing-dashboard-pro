import { useImperativeHandle, useState } from 'react'
import { Action, IModalProps, ModalVariables } from '@/types/modal.ts'
import { Form, Modal } from 'antd'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { message } from '@/context/AntdGlobalProvider.ts'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

/**
 * 角色弹窗: 创建&编辑
 */
export default function RoleModal({ currentRef, onRefresh }: IModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState<Action>('create')
  const title = (action === 'create' ? '创建' : '编辑') + '角色'

  // 开启当前组件的弹窗显示
  const openModal = (action: Action, data?: any) => {
    if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, data)
    fetchRoles()
    setAction(action)
    setShowModal(true)
    form.setFieldsValue(data)
  }
  // 关闭当前组件的弹窗显示
  const closeModal = () => {
    setShowModal(false)
    form.resetFields()
  }
  useImperativeHandle(currentRef, () => ({ openModal, closeModal })) // 暴露方法给父组件使用

  // 获取角色列表
  const fetchRoles = async () => {
    const data = await []
    setRoles(data)
    setLoading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (isDebugEnable) log.warn('表单数据：', form.getFieldsValue())
      const validate = await form.validateFields()
      if (!validate) return
      // const formData = form.getFieldsValue()
      if (action === 'create') {
        // await api.role.add(formData) //todo
      } else if (action === 'edit') {
        // await api.role.edit(formData) //todo
      }
      message.success('操作成功')
      closeModal() // 关闭弹窗
      onRefresh() // 执行刷新回调
    } catch (error) {
      if (isDebugEnable) log.error('操作失败: ', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={title}
      width={ModalVariables.width}
      open={showModal}
      onOk={handleSubmit}
      okButtonProps={{ loading, icon: <CheckCircleOutlined /> }}
      okText={'确定'}
      onCancel={closeModal}
      cancelButtonProps={{ disabled: loading, icon: <CloseCircleOutlined /> }}
      cancelText={'取消'}
    >
      <Form
        {...ModalVariables.layout}
        form={form}
        style={{ maxWidth: 600 }}
        initialValues={{ menuType: 1, menuState: 1 }}
      >
        {roles}
      </Form>
    </Modal>
  )
}
