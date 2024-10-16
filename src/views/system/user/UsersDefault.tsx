import { Button, Form, Input, Select, Space, Table, TableColumnsType, TablePaginationConfig, Tooltip } from 'antd'
import { PageArgs, User } from '@/types/apiType.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'
import api from '@/api'
import React, { useEffect, useRef, useState } from 'react'
import { formatDateToLocalString, formatUserRole, formatUserStatus } from '@/utils'
import UserModal from '@/views/system/user/UserModal.tsx'
import { ModalAction } from '@/types/modal.ts'
import { message, modal } from '@/context/AntdGlobalProvider.ts'
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'

/**
 * 使用原生方式实现用户列表
 * @constructor
 */
export default function UsersDefault() {
  const isMockEnable = false
  const [form] = Form.useForm()
  const [users, setUsers] = useState<User.UserItem[]>([])
  const [loading, setLoading] = useState(false)
  const [userIds, setUserIds] = useState<number[]>([])
  const [pagination, setPagination] = useState<TablePaginationConfig>({ current: 1, pageSize: 10, total: 0 })

  const currentRef = useRef<ModalAction>({
    openModal: (action, data?: User.UserItem) => {
      if (isDebugEnable) log.info('开开弹窗: ', action, data)
    },
  })
  const onCreate = () => {
    currentRef?.current?.openModal('create')
  }
  const onUserEdit = (record: User.UserItem) => {
    currentRef?.current?.openModal('edit', record) // 打开编辑弹窗
  }
  const onUserDelete = (userIds: number[]) =>
    modal.confirm({
      title: '确认删除用户',
      content: '确认要删除所选用户吗？',
      onOk: async () => {
        try {
          await api.user.deleteUser(userIds)
          await getUsers({})
          message.success('删除成功')
        } catch (e) {
          log.error(e)
          message.success('删除失败')
        }
      },
    })

  useEffect(() => {
    const { current, pageSize } = pagination
    getUsers({ pageNum: current, pageSize })
  }, [pagination.current, pagination.pageSize])

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
            <Tooltip title="删除">
              <Button icon={<DeleteOutlined />} shape="circle" danger onClick={() => onUserDelete([record.userId])} />
            </Tooltip>
            <Tooltip title="编辑">
              <Button icon={<EditOutlined />} shape="circle" onClick={() => onUserEdit(record)} />
            </Tooltip>
          </Space>
        )
      },
    },
  ]

  async function getUsers(args: PageArgs) {
    const { pageNum, pageSize } = args
    try {
      setLoading(true)
      const values = form.getFieldsValue()
      // 清理掉 undefined 或者 null 的字段
      const cleanedValues = Object.keys(values).reduce(
        (acc, key) => {
          const value = values[key]
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, any>
      )
      const params = {
        ...cleanedValues,
        pageNum: pageNum ?? pagination.current ?? 1,
        pageSize: pageSize ?? pagination.pageSize ?? 10,
      }

      if (isDebugEnable) log.info('搜索条件: ', params)

      const data = await api.user.getUserList(params)
      const { list } = data
      if (isDebugEnable) log.info('搜索列表: ', list)

      if (isMockEnable) {
        const totalItems = 9999 // 模拟总条数
        const items = Array.from({ length: totalItems }).map((_, index) => ({
          ...list[0],
          userId: Math.random() * 1000000 + index,
          userName: `User${index + 1}`,
          userEmail: `user${index + 1}@example.com`,
          role: index % 3, // 模拟用户角色
          state: index % 4, // 模拟用户状态
          createTime: new Date().toISOString(),
          lastLoginTime: new Date().toISOString(),
        }))
        const paginatedItems = items.slice(
          ((args.pageNum ?? 1) - 1) * (args.pageSize ?? 10),
          (args.pageNum ?? 1) * (args.pageSize ?? 10)
        )
        setUsers(paginatedItems)
        setPagination({ total: totalItems, current: args.pageNum, pageSize: args.pageSize })
      } else {
        setUsers(list)
        const totalItems = 9838 // API 有问题
        if (list.length !== 0) {
          setPagination({ total: totalItems, current: args.pageNum, pageSize: args.pageSize })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  function handlePageChange(current: number, pageSize: number) {
    setPagination({ current, pageSize })
  }

  function handleSearch() {
    getUsers({})
  }

  function handleReset() {
    form.resetFields()
    getUsers({})
  }

  function onBatchDelete() {
    if (userIds.length === 0) {
      message.warning('请选择需要删除的用户')
      return
    }
    onUserDelete(userIds)
    setUserIds([])
  }

  return (
    <div className="sidebar-submenu">
      <Form className="search-box" form={form} layout={'inline'} initialValues={{ state: null }}>
        <Form.Item name="userId" label={'用户ID'}>
          <Input placeholder={'请输入用户ID'} />
        </Form.Item>
        <Form.Item name="userName" label={'用户名称'}>
          <Input placeholder={'请输入用户名称'} />
        </Form.Item>
        <Form.Item name="state" label={'状态'} style={{ width: 120 }}>
          <Select onChange={() => getUsers({})}>
            <Select.Option value={null}>所有</Select.Option>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>离职</Select.Option>
            <Select.Option value={3}>试用期</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button icon={<SearchOutlined />} type="primary" onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} type="default" htmlType={'reset'} onClick={handleReset}>
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
              <Button icon={<PlusOutlined />} type={'primary'} danger={false} onClick={onCreate}>
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
          loading={loading}
          bordered
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: userIds,
            onChange: (selectedRowKeys: React.Key[]) => {
              setUserIds(selectedRowKeys as number[])
            },
          }}
          dataSource={users}
          columns={columns}
          rowKey={record => record.userId}
          pagination={{
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
            showTotal: total => `共 ${total} 条`,
            onChange: (current, pageSize) => handlePageChange(current, pageSize),
          }}
        />
        <UserModal currentRef={currentRef} onRefresh={() => getUsers({})} />
      </div>
    </div>
  )
}
