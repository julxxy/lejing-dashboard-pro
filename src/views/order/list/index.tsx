import { Button, Form, Input, Select, Space, Table, TableColumnsType, Tooltip } from 'antd'
import React, { useRef, useState } from 'react'
import { ModalAction } from '@/types/modal.ts'
import { Order } from '@/types/apiType.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'
import api from '@/api'
import { useAntdTable } from 'ahooks'
import { message, modal } from '@/context/AntdGlobalProvider.ts'
import { formatDateToLocalString, formatMoneyCNY, formatOrderStatus } from '@/utils'
import {
  DatabaseOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  PushpinOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import OrderPointModal from '@/views/order/list/OrderPointModal.tsx'
import OrderRouteModal from '@/views/order/list/OrderRouteModal.tsx'
import OrderModal from '@/views/order/list/OrderModal.tsx'
import orders from '@/mockdata/orders.json'
import DynamicAtnButton from '@/components/DynamicAntButton.tsx'

/**
 * 订单列表
 * @constructor
 */
export default function OrderList() {
  const [form] = Form.useForm()
  const [ids, setIds] = useState<string[]>([])
  const [showMockButton, setShowMockButton] = useState(false)

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
  const fetchPageData = async (
    {
      current,
      pageSize,
    }: {
      current: number
      pageSize: number
    },
    formData: Order.SearchArgs
  ) => {
    const result = await api.order.getOrderList({ ...formData, pageNum: current, pageSize })
    setShowMockButton(result.page.total === 0 && result.list.length === 0)
    return {
      total: result.page.total,
      list: result.list,
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

  const onOrderDelete = (ids: string[]) =>
    modal.confirm({
      title: '确认删除订单',
      content: '确认要删除所选订单吗？',
      onOk: () => {
        try {
          api.order.delete(ids)
          search.reset()
          message.success('删除成功')
        } catch (e) {
          log.error(e)
          message.success('删除失败')
        }
      },
    })

  function handleOrderDetail(record: Order.OrderItem) {
    detailRef?.current?.openModal('view', record)
  }

  // Table columns
  const columns: TableColumnsType<Order.OrderItem> = [
    { title: '订单编号', dataIndex: 'orderId', key: 'orderId', width: 160, fixed: true },
    { title: '城市', dataIndex: 'cityName', key: 'cityName' },
    {
      title: '下单地址',
      dataIndex: 'address',
      key: 'address',
      render(_, record) {
        return (
          <div>
            <p>起点：{record.startAddress}</p>
            <p>终点：{record.endAddress}</p>
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
      render: (state: number) => formatMoneyCNY(state),
    },
    { title: '订单状态', dataIndex: 'state', key: 'state', render: (state: number) => formatOrderStatus(state) },
    { title: '用户名称', dataIndex: 'userName', key: 'userName' },
    { title: '司机名称', dataIndex: 'driverName', key: 'driverName' },
    {
      title: '操作',
      key: 'operate',
      render(record: Order.OrderItem) {
        return (
          <Space>
            <Tooltip title="地图打点">
              <Button
                icon={<PushpinOutlined />}
                shape="circle"
                onClick={() => pointRef?.current?.openModal('create')}
              />
            </Tooltip>
            <Tooltip title="行驶轨迹">
              <Button
                icon={<EnvironmentOutlined />}
                shape="circle"
                onClick={() => routeRef?.current?.openModal('create')}
              />
            </Tooltip>
            <Tooltip title="详情">
              <Button icon={<InfoCircleOutlined />} shape="circle" onClick={() => handleOrderDetail(record)} />
            </Tooltip>
            <Tooltip title="删除">
              <Button icon={<DeleteOutlined />} shape="circle" danger onClick={() => onOrderDelete([record._id])} />
            </Tooltip>
          </Space>
        )
      },
    },
  ]

  function onBatchDelete() {
    if (ids.length === 0) {
      message.warning('请选择需要删除的条目')
      return
    }
    onOrderDelete(ids)
    setIds([])
  }

  // Mock data
  function mockOrders() {
    const _orders = orders as Order.OrderItem[]
    _orders.forEach((item, index) => {
      setTimeout(() => {
        api.order.add(item).then(result => {
          log.info('mock result: ', result)
        })
      }, index * 1000) // 根据 index 计算延迟时间，每次增加 1 秒
    })
  }

  return (
    <div className="sidebar-submenu">
      <Form className="search-box" form={form} layout={'inline'} initialValues={{ state: null }}>
        <Form.Item name="orderId" label={'订单编号'}>
          <Input placeholder={'请输入订单编号'} />
        </Form.Item>
        <Form.Item name="userName" label={'用户名称'}>
          <Input placeholder={'请输入用户名称'} />
        </Form.Item>
        <Form.Item name="state" label={'订单状态'}>
          <Select style={{ width: 120 }} onChange={() => search.submit()}>
            <Select.Option value={null}>全部</Select.Option>
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
              <DynamicAtnButton icon={<DatabaseOutlined />} onClick={mockOrders} show={showMockButton}>
                造数据
              </DynamicAtnButton>
              <Button icon={<PlusOutlined />} type={'primary'} onClick={() => detailRef?.current?.openModal('create')}>
                新建
              </Button>
              <Button icon={<ExportOutlined />} type={'primary'} onClick={() => {}}>
                导出
              </Button>
              <DynamicAtnButton
                icon={<DeleteOutlined />}
                type={'primary'}
                danger={true}
                onClick={() => onBatchDelete()}
                show={true}
              >
                批量删除
              </DynamicAtnButton>
            </Space>
          </div>
        </div>
        <Table<Order.OrderItem>
          scroll={{ x: 'max-content' }} //启用表格水平滚动
          bordered
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: ids,
            onChange: (selectedRowKeys: React.Key[]) => {
              setIds(selectedRowKeys as string[])
            },
          }}
          columns={columns}
          rowKey={record => record._id}
          {...tableProps}
        />
        <OrderModal currentRef={detailRef} onRefresh={() => search.reset()} />
        <OrderPointModal currentRef={pointRef} onRefresh={() => search.reset()} />
        <OrderRouteModal currentRef={routeRef} onRefresh={() => search.reset()} />
      </div>
    </div>
  )
}
