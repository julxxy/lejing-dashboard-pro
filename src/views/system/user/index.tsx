import { Button, Form, Input, Select, Space, Table, TableColumnsType, TablePaginationConfig } from 'antd'
import { PageArgs, User } from '@/types/apiTypes.ts'
import { isDebugEnable } from '@/common/debugProvider.ts'
import log from '@/common/loggerProvider.ts'
import api from '@/api'
import { useEffect, useState } from 'react'
import { formatDateToLocalString, formatUserRole, formatUserStatus } from '@/utils'

export default function UserList() {
  const [form] = Form.useForm()
  const [users, setUsers] = useState<User.UserItem[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<TablePaginationConfig>({ current: 1, pageSize: 10, total: 0 })
  const isMockEnable = false

  useEffect(() => {
    fetchUsers({ pageNum: pagination.current, pageSize: pagination.pageSize })
  }, [pagination.current, pagination.pageSize])

  const columns: TableColumnsType<User.UserItem> = [
    { title: '用户ID', dataIndex: 'userId', key: 'userId' },
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
      dataIndex: 'operate',
      key: 'operate',
      render(record, value) {
        if (!isDebugEnable) {
          log.info('operate', record, value)
        }
        return (
          <Space>
            <Button size={'small'} color="primary" variant="dashed" shape={'round'}>
              编辑
            </Button>
            <Button size={'small'} type="dashed" shape={'round'} danger={true}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  async function fetchUsers(args: PageArgs) {
    try {
      setLoading(true)
      const values = form.getFieldsValue()
      const params = { ...values, pageNum: args.pageNum, pageSize: args.pageSize }

      if (isDebugEnable) log.info('搜索条件: ', params)

      const [data] = await Promise.all([api.getUserList(params)])
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
        const total = 9999 // 修正总条数，API 有问题，返回不对
        setUsers(list)
        setPagination({ total, current: args.pageNum, pageSize: args.pageSize })
      }
    } finally {
      setLoading(false)
    }
  }

  function handlePaginationChange(current: number, pageSize: number) {
    setPagination({ ...pagination, current, pageSize })
  }

  function handleSearch() {
    setPagination({ ...pagination, current: 1 })
    fetchUsers({ pageNum: 1, pageSize: pagination.pageSize })
  }

  function handleReset() {
    form.resetFields()
    setPagination({ ...pagination, current: 1 })
    fetchUsers({ pageNum: 1, pageSize: pagination.pageSize })
  }

  return (
    <div className="user-list">
      <Form className="search-box" form={form} layout={'inline'} initialValues={{ state: 1 }}>
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
            <Button type="primary" className={'-'} onClick={handleSearch}>
              搜索
            </Button>
            <Button type="default" htmlType={'reset'} onClick={handleReset}>
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
              <Button type={'primary'}>添加</Button>
              <Button type={'primary'} danger={true}>
                删除
              </Button>
            </Space>
          </div>
        </div>
        <Table<User.UserItem>
          scroll={{ x: 'max-content' }} //启用表格水平滚动
          loading={loading}
          bordered
          rowSelection={{ type: 'checkbox' }}
          dataSource={users}
          columns={columns}
          rowKey="userId"
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
            onChange: (current, pageSize) => handlePaginationChange(current, pageSize),
          }}
        />
      </div>
    </div>
  )
}
