import RoleModal from '@/views/system/role/RoleModal.tsx'
import { useEffect, useRef } from 'react'
import { ModalAction } from '@/types/modal.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'
import api from '@/api'
import { useAntdTable } from 'ahooks'
import { Role } from '@/types/apiType.ts'
import { Button, Form, Input, Space, Table, TableColumnsType, Tooltip } from 'antd'
import { message, modal } from '@/context/AntdGlobalProvider.ts'
import { formatDateToLocalString } from '@/utils'
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import PermissionModal from '@/views/system/role/PermissionModal.tsx'

export default function RoleList() {
  const [form] = Form.useForm()
  const roleRef = useRef<ModalAction>({
    openModal: (action, data?: Role.EditParams | { parentId?: string; orderBy?: number }) => {
      if (isDebugEnable) log.info('开启角色弹窗: ', action, data)
    },
  })
  const permissionRef = useRef<ModalAction>({
    openModal: (action, data?: Role.EditParams | { parentId?: string; orderBy?: number }) => {
      if (isDebugEnable) log.info('开权限弹窗: ', action, data)
    },
  })

  // 获取分页数据
  const fetchTableData = async (
    { current, pageSize }: { current: number; pageSize: number },
    formData: Role.SearchArgs
  ) => {
    const res = await api.role.page({ ...formData, pageNum: current, pageSize })
    return {
      total: res.page.total,
      list: res.list,
    }
  }
  // 封装分页配置
  const { tableProps, search } = useAntdTable(fetchTableData, { form, defaultPageSize: 10 })
  const { pagination } = tableProps
  tableProps.pagination = {
    ...pagination, // 分页参数
    showSizeChanger: true, // 显示分页大小选择器
    pageSizeOptions: ['10', '20', '50', '100'], // 每页条数选项
    locale: {
      items_per_page: '条/页',
      jump_to: '跳至',
      page: '页',
      prev_page: '上一页',
      next_page: '下一页',
      jump_to_confirm: '确定',
    },
    showTotal: (total: any) => `共 ${total} 条`,
  }

  function onEdit(record: Role.RoleDetail) {
    roleRef.current.openModal('edit', record)
  }

  function assignPermission(record: Role.RoleDetail) {
    permissionRef.current.openModal('edit', record)
  }

  const columns: TableColumnsType<Role.RoleDetail> = [
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: string) => formatDateToLocalString(text),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text: string) => formatDateToLocalString(text),
    },
    {
      title: '操作',
      key: 'operate',
      width: 80,
      render(record: Role.RoleDetail) {
        return (
          <Space>
            <Tooltip title="编辑">
              <Button
                icon={<EditOutlined />}
                shape="circle"
                key={`edit-${record._id}`}
                onClick={() => onEdit(record)}
              />
            </Tooltip>
            <Tooltip title="设置权限">
              <Button
                key={`assign-${record._id}`}
                icon={<EditOutlined />}
                shape="circle"
                onClick={() => assignPermission(record)}
              />
            </Tooltip>
            <Tooltip title="删除">
              <Button
                key={`delete-${record._id}`}
                icon={<DeleteOutlined />}
                shape="circle"
                danger
                onClick={() => onDelete(record._id)}
              />
            </Tooltip>
          </Space>
        )
      },
    },
  ]

  const onDelete = (_id: string) =>
    modal.confirm({
      title: '确认删除权限',
      content: '确认要删除所选权限吗？',
      onOk: () => {
        api.role.delete(_id).then(() => {
          search.reset()
          message.success('删除成功')
        })
      },
    })

  useEffect(() => {}, [])

  return (
    <div className={'sidebar-submenu'}>
      <Form form={form} className="search-box" layout="inline">
        <Form.Item name="roleName" label="角色名称">
          <Input placeholder={'请输入角色名称'} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button icon={<SearchOutlined />} type="primary" onClick={() => search.submit()}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} htmlType={'reset'} onClick={() => search.reset()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className="base-table">
        <div className="header-wrapper">
          <div className="title">用户列表</div>
          <div className="actions">
            <Button
              icon={<PlusOutlined />}
              type={'primary'}
              danger={false}
              onClick={() => roleRef?.current?.openModal('create')}
            >
              添加
            </Button>
          </div>
        </div>
        <Table<Role.RoleDetail>
          scroll={{ x: 'max-content' }} //启用表格水平滚动
          bordered
          columns={columns}
          rowKey={record => record._id}
          {...tableProps}
        />
      </div>
      <RoleModal currentRef={roleRef} onRefresh={() => search.reset()} />
      <PermissionModal currentRef={permissionRef} onRefresh={() => search.reset()} />
    </div>
  )
}
