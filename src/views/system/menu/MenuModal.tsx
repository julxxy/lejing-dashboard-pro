import { useImperativeHandle, useState } from 'react'
import { Action, IModalProps, ModalVariables } from '@/types/modal.ts'
import { Form, Input, Modal, Radio, TreeSelect } from 'antd'
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
      if (isDebugEnable) log.warn('表单数据：', form.getFieldsValue())
      const validate = await form.validateFields()
      if (!validate) return
      const formData = form.getFieldsValue()
      if (action === 'create') {
        await api.menu.add(formData)
      } else if (action === 'edit') {
        await api.menu.edit(formData)
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
      okButtonProps={{ loading }}
      okText={'确定'}
      onCancel={closeModal}
      cancelText={'取消'}
    >
      <Form
        {...ModalVariables.layout}
        form={form}
        style={{ maxWidth: 600 }}
        initialValues={{ menuType: 1, menuState: 1 }}
      >
        <Form.Item hidden={true} name={'_id'}>
          <Input />
        </Form.Item>
        <Form.Item name="parentId" label="父级菜单">
          <TreeSelect
            placeholder={'请选择父级菜单'}
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: 'menuName', value: '_id' }}
            treeData={menus}
          />
        </Form.Item>
        <Form.Item name="menuType" label="菜单类型">
          <Radio.Group
            options={[
              { label: '菜单', value: 1 },
              { label: '按钮', value: 2 },
              { label: '页面', value: 3 },
            ]}
            optionType="default"
          />
        </Form.Item>
        <Form.Item name={'menuState'} label={'菜单状态'}>
          <Radio.Group
            options={[
              { label: '正常', value: 1 },
              { label: '停用', value: 2 },
            ]}
            optionType="default"
          />
        </Form.Item>
        <Form.Item name={'menuName'} label={'菜单名称'} rules={[{ required: true, message: '请输入菜单名称' }]}>
          <Input placeholder={'请输入菜单名称'} required={true} />
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {() => {
            if (form.getFieldValue('menuType') === 2) {
              return (
                <>
                  <Form.Item name={'menuCode'} label={'权限标识'}>
                    <Input placeholder={'请输入权限标识'} />
                  </Form.Item>
                </>
              )
            } else {
              return (
                <>
                  <Form.Item name="icon" label="菜单图标">
                    <Input placeholder={'请输入菜单图标'} />
                  </Form.Item>
                  <Form.Item name="path" label="路由地址">
                    <Input placeholder={'请输入路由地址'} />
                  </Form.Item>
                </>
              )
            }
          }}
        </Form.Item>
        <Form.Item name="component" label="组件名称">
          <Input placeholder={'请输入组件名称'} />
        </Form.Item>
        <Form.Item name="sort" label="菜单排序" tooltip={{ title: '数值越小越靠前' }}>
          <Input placeholder="排序值" min={0} type="number" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
