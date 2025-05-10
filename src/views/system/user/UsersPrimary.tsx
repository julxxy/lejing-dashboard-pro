import { Button, Form, Input, Select, Space, Table, TableColumnsType, Tooltip } from 'antd'
import { User } from '@/types'
import { isDebugEnable, log } from '@/common/Logger.ts'
import api from '@/api'
import React, { useRef, useState } from 'react'
import { formatDateToLocalString, formatUserRole, formatUserStatus } from '@/utils'
import UserModal from '@/views/system/user/UserModal.tsx'
import { Action, ModalAction } from '@/types/modal.ts'
import { message, modal } from '@/context/AntdGlobalProvider.ts'
import { useAntdTable } from 'ahooks'
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'

/**
 * 使用 ahooks 实现用户列表
 * @constructor
 */
export default function UsersPrimary() {
  const [form] = Form.useForm()
  const [userIds, setUserIds] = useState<number[]>([])
  const [action, setAction] = useState<Action>('create')
  const currentRef = useRef<ModalAction>({
    openModal: (action, data?: User.UserItem) => {
      if (isDebugEnable) log.info('开开弹窗: ', action, data)
      setAction(action)
    },
  })

  // 1. 获取分页数据
  const fetchTableData = async (
    {
      current,
      pageSize,
    }: {
      current: number
      pageSize: number
    },
    formData: User.RequestArgs
  ) => {
    const res = await api.user.getUserList({ ...formData, pageNum: current, pageSize })
    return {
      total: res.page.total,
      list: res.list,
    }
  }
  // 2. 分页配置
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

  const onUserDelete = (userIds: number[]) =>
    modal.confirm({
      title: '确认删除用户',
      content: '确认要删除所选用户吗？',
      onOk: () => {
        api.user.deleteUser(userIds).then(() => {
          search.reset()
          message.success('删除成功')
        })
      },
    })

  function onBatchDelete() {
    if (userIds.length === 0) {
      message.warning('请选择需要删除的用户')
      return
    }
    onUserDelete(userIds)
    setUserIds([])
  }

  function onUserEdit(record: User.UserItem) {
    currentRef?.current?.openModal('edit', record)
  }

  const columns: TableColumnsType<User.UserItem> = [
    { title: '用户ID', dataIndex: 'userId', key: 'userId', fixed: true },
    { title: '用户名', dataIndex: 'userName', key: 'userName' },
    { title: '用户邮箱', dataIndex: 'userEmail', key: 'userEmail' },
    { title: '用户角色', dataIndex: 'role', key: 'role', render: (role: number) => formatUserRole(role) },
    { title: '用户状态', dataIndex: 'state', key: 'state', render: (state: number) => formatUserStatus(state) },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (createTime: string) => formatDateToLocalString(createTime),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      render: (lastLoginTime: string) => formatDateToLocalString(lastLoginTime),
    },
    {
      title: '操作',
      key: 'operate',
      render(record: User.UserItem) {
        return (
          <Space>
            <Tooltip title="编辑">
              <Button icon={<EditOutlined />} shape="circle" onClick={() => onUserEdit(record)} />
            </Tooltip>
            <Tooltip title="删除">
              <Button icon={<DeleteOutlined />} shape="circle" danger onClick={() => onUserDelete([record.userId])} />
            </Tooltip>
          </Space>
        )
      },
    },
  ]

  return (
    <div className="main-content-menu">
      <Form className="search-box" form={form} layout={'inline'} initialValues={{ state: 0 }}>
        <Form.Item name="userId" label={'用户ID'}>
          <Input placeholder={'请输入用户ID'} />
        </Form.Item>
        <Form.Item name="userName" label={'用户名称'}>
          <Input placeholder={'请输入用户名称'} />
        </Form.Item>
        <Form.Item name="state" label={'状态'} style={{ width: 120 }}>
          <Select>
            <Select.Option value={0}>所有</Select.Option>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>离职</Select.Option>
            <Select.Option value={3}>试用期</Select.Option>
          </Select>
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
            <Space>
              <Tooltip title="地图打点"></Tooltip>
              <Button
                icon={<PlusOutlined />}
                type={'primary'}
                danger={false}
                onClick={() => currentRef?.current?.openModal('create')}
              >
                添加
              </Button>
              <Button icon={<DeleteOutlined />} type={'primary'} danger={true} onClick={() => onBatchDelete()}>
                批量删除
              </Button>
            </Space>
          </div>
        </div>
        <Table<User.UserItem>
          scroll={{ x: 'max-content' }} //启用表格水平滚动
          bordered
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: userIds,
            onChange: (selectedRowKeys: React.Key[]) => {
              setUserIds(selectedRowKeys as number[])
            },
          }}
          columns={columns}
          rowKey={record => record.userId}
          {...tableProps}
        />
        <UserModal
          parentRef={currentRef}
          onRefresh={() => {
            return action === 'create' ? search.reset() : search.submit()
          }}
        />
      </div>
    </div>
  )
}
