import { useImperativeHandle, useState } from 'react'
import { Action, IModalProps, ModalVariables } from '@/types/modal.ts'
import { Form, Input, Modal, Select, TreeSelect } from 'antd'
import { Department, User } from '@/types/apiTypes.ts'
import { debugEnable, log } from '@/common/loggerProvider.ts'
import api from '@/api'
import { message } from '@/context/AntdGlobalProvider.ts'

/**
 * 创建/编辑菜单弹窗
 */
export default function MenuModal({ currentRef, onRefreshed }: IModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [deptList, setDeptList] = useState<Department.Item[]>([])
  const [allUsers, setAllUsers] = useState<User.UserItem[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [action, setAction] = useState<Action>('create')

  // 开启当前组件的弹窗显示
  const openModal = (action: Action, data?: Department.EditParams | { parentId: string }) => {
    if (debugEnable) log.info('收到父组件的弹窗显示请求: ', action, data)
    fetchDeptList()
    fetchAllUsers()
    setAction(action)
    setModalOpen(true)
    form.setFieldsValue(data)
    log.info(form.getFieldsValue())
  }
  // 关闭当前组件的弹窗显示
  const closeModal = () => {
    setModalOpen(false)
    form.resetFields()
  }
  useImperativeHandle(currentRef, () => ({ openModal, closeModal })) // 暴露方法给父组件使用
  const fetchDeptList = async () => {
    const deptList = await api.dept.getDepartments()
    setDeptList(deptList)
    setLoading(false)
  }

  const fetchAllUsers = async () => {
    const allUsers = await api.user.getAllUsers()
    setAllUsers(allUsers)
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
      onRefreshed() // 执行刷新回调
    } catch (error) {
      if (debugEnable) log.error('操作失败: ', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={action === 'create' ? '创建菜单' : '编辑菜单'}
      width={ModalVariables.width}
      open={modalOpen}
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
            treeData={deptList}
          />
        </Form.Item>

        <Form.Item name={'deptName'} label={'部门名称'} rules={[{ required: true, message: '请输入部门名称' }]}>
          <Input placeholder={'请输入部门名称'} required={true} />
        </Form.Item>

        <Form.Item name="userName" label={'负责人'} rules={[{ required: true, message: '请选择负责人' }]}>
          <Select placeholder={'请选择负责人'}>
            {allUsers.map(({ userName, _id }) => (
              <Select.Option value={userName} key={_id}>
                {userName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
