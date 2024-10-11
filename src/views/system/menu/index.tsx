import MenuModal from '@/views/system/menu/MenuModal.tsx'
import { message, modal } from '@/context/AntdGlobalProvider.ts'
import api from '@/api'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useRef, useState } from 'react'
import { ModalAction } from '@/types/modal.ts'
import { Button, Form, Input, Radio, Space, Table, TableColumnsType } from 'antd'
import { Menu } from '@/types/ApiTypes.ts'
import { formatDateToLocalString } from '@/utils'

/**
 * @file 菜单管理页面
 */
export default function MenuFC() {
  const [form] = useForm()
  const [data, setData] = useState<Menu.Item[]>([])
  const [loading, setLoading] = useState(false)
  const menuRef = useRef<ModalAction>({
    openModal: (action, data?: Menu.EditParams | { parentId: string }) => {
      if (isDebugEnable) log.info('开开弹窗: ', action, data)
    },
    closeModal: () => {
    },
  })

  useEffect(() => {
    getMenus()
  }, [])

  async function getMenus() {
    setLoading(!loading)
    const data = await api.menu.getMenus(form.getFieldsValue())
    setData(data)
    setLoading(false)
  }

  function handleDelete(_id?: string) {
    log.info('删除部门')
    modal.confirm({
      title: '确认删除用户',
      content: '确认要删除所选菜单吗？',
      onOk: async () => {
        if (!_id) return
        await api.menu.delete(_id)
        message.success('删除成功')
        getMenus()
      },
    })
  }

  function handleEdit(record?: Menu.Item) {
    menuRef?.current?.openModal('edit', record) // 打开弹窗
  }

  function handleMainCreate() {
    menuRef?.current?.openModal('create') // 打开弹窗
  }

  const handleSubCreate = (parentId?: string) => {
    menuRef?.current?.openModal('create', { parentId }) // 打开弹窗
  }

  function handleReset() {
    form.resetFields()
    getMenus()
  }

  const columns: TableColumnsType<Menu.Item> = [
    { title: '菜单名称', key: 'menuName', dataIndex: 'menuName', width: 150 },
    { title: '菜单图标', key: 'icon', dataIndex: 'icon', width: 100 },
    {
      title: '菜单类型',
      key: 'menuType',
      dataIndex: 'menuType',
      render: (menuType: number) => {
        return {
          1: '菜单',
          2: '按钮',
          3: '页面',
        }[menuType]
      },
    },
    { title: '权限标识', key: 'menuCode', dataIndex: 'menuCode' },
    { title: '菜单路径', key: 'path', dataIndex: 'path' },
    { title: '组件名称', key: 'component', dataIndex: 'component' },
    { title: '创建时间', key: 'createTime', dataIndex: 'createTime', render: text => formatDateToLocalString(text) },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_text, record?: Menu.Item) => {
        return (
          <Space>
            <Button color={'primary'} variant={'dashed'} onClick={() => handleSubCreate(record?._id)}>
              新增
            </Button>
            <Button color={'primary'} variant={'dashed'} onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type={'dashed'} danger={true} onClick={() => handleDelete(record?._id)}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ]
  return (
    <div className="sidebar-submenu">
      <Form className={'search-box'} layout={'inline'} form={form} initialValues={{ menuState: undefined }}>
        <Form.Item name={'menuName'} label={'菜单名称'}>
          <Input placeholder={'请输入菜单名称'} />
        </Form.Item>
        <Form.Item name={'menuState'} label={'状态'}>
          <Radio.Group
            options={[
              { label: '所有', value: undefined },
              { label: '正常', value: 1 },
              { label: '停用', value: 2 },
            ]}
            optionType="button"
            onChange={getMenus}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type={'primary'} onClick={() => getMenus()}>
              搜索
            </Button>
            <Button type={'default'} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className="base-table">
        <div className="header-wrapper">
          <div className="title">菜单列表</div>
          <div className="action">
            <Button type={'primary'} onClick={handleMainCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table bordered rowKey={'_id'} columns={columns} dataSource={data} pagination={false} loading={loading} />
      </div>
      <MenuModal currentRef={menuRef} onRefresh={getMenus} />
    </div>
  )
}
