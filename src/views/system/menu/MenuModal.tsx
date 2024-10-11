import { useImperativeHandle, useState } from 'react'
import { Action, IModalProps, ModalVariables } from '@/types/modal.ts'
import { Form, Input, Modal, Select, TreeSelect } from 'antd'
import { Department, Menu } from '@/types/ApiTypes.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'
import api from '@/api'
import { message } from '@/context/AntdGlobalProvider.ts'

/**
 * 菜单弹窗: 创建&编辑
 */
export default function MenuModal({ currentRef, onRefresh }: IModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [menus, setMenus] = useState<Menu.Item[]>([])
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState<Action>('create')
  const title = (action === 'create' ? '创建' : '编辑') + '菜单'

  // 开启当前组件的弹窗显示
  const openModal = (action: Action, data?: Department.EditParams | { parentId: string }) => {
    if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, data)
    fetchMenus()
    setAction(action)
    setShowModal(true)
    form.setFieldsValue(data)
    log.info(form.getFieldsValue())
  }
  // 关闭当前组件的弹窗显示
  const closeModal = () => {
    setShowModal(false)
    form.resetFields()
  }
  useImperativeHandle(currentRef, () => ({ openModal, closeModal })) // 暴露方法给父组件使用
  const fetchMenus = async () => {
    const data = await api.menu.getMenus(form.getFieldsValue())
    setMenus(data)
    setLoading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      log.warn(form.getFieldsValue())
      const validate = await form.validateFields()
      if (!validate) return
      const formData = form.getFieldsValue()
      if (action === 'create') {
        await api.dept.add(formData)
      } else if (action === 'edit') {
        await api.dept.edit(formData)
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
      okButtonProps={{ loading, className: 'cta-button' }}
      okText={'确定'}
      onCancel={closeModal}
      cancelText={'取消'}
    >
      <Form {...ModalVariables.layout} form={form} style={{ maxWidth: 600 }}>
        <Form.Item hidden={true} name={'_id'}>
          <Input />
        </Form.Item>

        <Form.Item name="parentId" label="上级部门">
          <TreeSelect
            placeholder={'请选择上级部门'}
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: 'deptName', value: '_id' }}
            treeData={menus}
          />
        </Form.Item>

        <Form.Item name={'deptName'} label={'部门名称'} rules={[{ required: true, message: '请输入部门名称' }]}>
          <Input placeholder={'请输入部门名称'} required={true} />
        </Form.Item>

        <Form.Item name="userName" label={'负责人'} rules={[{ required: true, message: '请选择负责人' }]}>
          <Select placeholder={'请选择负责人'}></Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
