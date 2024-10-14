import { Button, Form, Input, Select, Space, Table, TableColumnsType } from 'antd'
import React, { useRef, useState } from 'react'
import { ModalAction } from '@/types/modal.ts'
import { Order, User } from '@/types/apiType.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'
import api from '@/api'
import { useAntdTable } from 'ahooks'
import { message, modal } from '@/context/AntdGlobalProvider.ts'
import { formatDateToLocalString, formatOrderStatus, formatUserStatus } from '@/utils'
import { DeleteOutlined, ExportOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import OrderPointModal from '@/views/order/list/OrderPointModal.tsx'
import OrderRouteModal from '@/views/order/list/OrderRouteModal.tsx'
import OrderDetailModal from '@/views/order/list/OrderDetailModal.tsx'

/**
 * 订单列表
 * @constructor
 */
export default function OrderList() {
  const [form] = Form.useForm()
  const [userIds, setUserIds] = useState<number[]>([])
  const orderRef = useRef<ModalAction>({
    openModal: (action, data?: any) => {
      if (isDebugEnable) log.info('开开弹窗: ', action, data)
    },
    closeModal: () => {},
  })
  const routeRef = useRef<ModalAction>({
    openModal: (action, data?: any) => {
      if (isDebugEnable) log.info('开开弹窗: ', action, data)
    },
    closeModal: () => {},
  })
  const pointRef = useRef<ModalAction>({
    openModal: (action, data?: any) => {
      if (isDebugEnable) log.info('开开弹窗: ', action, data)
    },
    closeModal: () => {},
  })
  const detailRef = useRef<ModalAction>({
    openModal: (action, data?: any) => {
      if (isDebugEnable) log.info('开开弹窗: ', action, data)
    },
    closeModal: () => {},
  })

  // pagination data source
  const fetchPageData = (
    {
      current,
      pageSize,
    }: {
      current: number
      pageSize: number
    },
    formData: User.RequestArgs
  ) => {
    const [res] = Promise.all(api.order.getOrderList({ ...formData, pageNum: current, pageSize }))
    return {
      total: 9999, //API 有问题，这里先写死
      list: res.list,
    }
  }
  // pagination config
  const { tableProps, search } = useAntdTable(fetchPageData, { form, defaultPageSize: 10 })
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

  const onOrderDelete = (userIds: number[]) =>
    modal.confirm({
      title: '确认删除用户',
      content: '确认要删除所选用户吗？',
      onOk: () => {
        try {
          Promise.all([api.order.delete(userIds)])
          search.reset()
          message.success('删除成功')
        } catch (e) {
          log.error(e)
          message.success('删除失败')
        }
      },
    })

  function onOrderEdit(record: Order.OrderItem) {
    pointRef?.current?.openModal('edit', record)
  }

  // Table columns: 订单编号	城市							操作
  const columns: TableColumnsType<Order.OrderItem> = [
    { title: '订单编号', dataIndex: 'orderId', key: 'orderId' },
    { title: '城市', dataIndex: 'cityName', key: 'cityName' },
    {
      title: '下单地址',
      dataIndex: 'address',
      key: 'address',
      render(_, record) {
        return (
          <div>
            <p>起点地址：{record.startAddress}</p>
            <p>终点地址：{record.endAddress}</p>
          </div>
        )
      },
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (createTime: string) => formatDateToLocalString(createTime),
    },
    {
      title: '订单价格',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render: (state: number) => formatUserStatus(state),
    },
    { title: '订单状态', dataIndex: 'state', key: 'state', render: (state: number) => formatOrderStatus(state) },
    { title: '用户名称', dataIndex: 'userName', key: 'userName' },
    { title: '司机名称', dataIndex: 'driverName', key: 'driverName' },
    {
      title: '操作',
      key: 'operate',
      render(record: User.UserItem) {
        return (
          <Space>
            <Button size="small" onClick={() => pointRef?.current?.openModal('create')}>
              打点
            </Button>
            <Button size="small" onClick={() => routeRef?.current?.openModal('create')}>
              轨迹
            </Button>
            <Button size="small" onClick={() => detailRef?.current?.openModal('create')}>
              详情
            </Button>
            <Button size="small" icon={<DeleteOutlined />} danger onClick={() => onOrderDelete([record.userId])}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  return (
    <div className="sidebar-submenu">
      <Form className="search-box" form={form} layout={'inline'} initialValues={{ state: 1 }}>
        <Form.Item name="orderId" label={'订单编号'}>
          <Input placeholder={'请输入订单编号'} />
        </Form.Item>
        <Form.Item name="useName" label={'用户名称'}>
          <Input placeholder={'请输入用户名称'} />
        </Form.Item>
        <Form.Item name="state" label={'订单状态'}>
          <Select style={{ width: 110 }}>
            <Select.Option value={0}>全部</Select.Option>
            <Select.Option value={1}>进行中</Select.Option>
            <Select.Option value={2}>已完成</Select.Option>
            <Select.Option value={3}>超时</Select.Option>
            <Select.Option value={4}>取消</Select.Option>
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
          <div className="title">订单列表</div>
          <div className="actions">
            <Space>
              <Button icon={<PlusOutlined />} type={'primary'} onClick={() => pointRef?.current?.openModal('create')}>
                添加
              </Button>
              <Button icon={<ExportOutlined />} type={'primary'} onClick={() => {}}>
                导出
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
          rowKey="userId"
          {...tableProps}
        />
        <OrderPointModal currentRef={pointRef} onRefresh={() => search.reset()} />
        <OrderRouteModal currentRef={routeRef} onRefresh={() => search.reset()} />
        <OrderDetailModal currentRef={detailRef} onRefresh={() => search.reset()} />
      </div>
    </div>
  )
}
