import { useImperativeHandle, useState } from 'react'
import { Action, IModalProps, ModalVariables } from '@/types/modal.ts'
import { Form, Input, Modal } from 'antd'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { message } from '@/context/AntdGlobalProvider.ts'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import api from '@/api'
import { Role } from '@/types'

/**
 * 角色弹窗: 创建&编辑
 */
export default function RoleModal({ parentRef, onRefresh }: IModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<Role.RoleDetail[]>([])
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState<Action>('create')
  const title = (action === 'create' ? '创建' : '编辑') + '角色'

  // 暴露方法给父组件使用
  useImperativeHandle(parentRef, () => modalController)
  const modalController = {
    // 开启弹窗显示
    openModal: (action: Action, data?: Role.RoleDetail) => {
      if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, data, roles)
      setLoading(true)
      setAction(action)
      fetchRoles()
      setShowModal(true)
      form.setFieldsValue(data)
    },
    // 关闭弹窗显示
    closeModal: () => {
      setShowModal(false)
      form.resetFields()
    },
  }

  // 获取角色列表
  const fetchRoles = async () => {
    const data = await api.role.getAll()
    setRoles(data)
    setLoading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (isDebugEnable) log.warn('表单数据：', form.getFieldsValue())
      const validate = await form.validateFields()
      if (!validate) return
      const formData = form.getFieldsValue()
      if (action === 'create') {
        await api.role.add(formData)
      } else if (action === 'edit') {
        await api.role.edit(formData)
      }
      message.success('操作成功')
      modalController.closeModal() // 关闭弹窗
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
      onCancel={modalController.closeModal}
      cancelButtonProps={{ disabled: loading, icon: <CloseCircleOutlined /> }}
      cancelText={'取消'}
    >
      <Form {...ModalVariables.layout} form={form} style={{ maxWidth: 600 }}>
        <Form.Item name={'_id'}>
          <Input type={'hidden'} />
        </Form.Item>
        <Form.Item
          name={'roleName'}
          label={'角色名称'}
          rules={[
            { required: true, message: '请输入角色名称' },
            { min: 2, message: '角色名称长度不能小于2个字符' },
            { max: 8, message: '角色名称长度不能大于8个字符' },
          ]}
        >
          <Input placeholder={'请输入角色名称'} required={true} />
        </Form.Item>
        <Form.Item name={'remark'} label={'角色描述'}>
          <Input.TextArea placeholder={'请输入角色描述'} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
