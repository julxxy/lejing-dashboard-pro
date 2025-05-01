import styles from '@/views/order/shipper/index.module.less'
import { Button, Form, Input, Select, Space, Table, TableColumnsType } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Shipper } from '@/types'
import { formatDateToLocalString, formatMoneyCNY } from '@/utils'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import api from '@/api'

/**
 * 货运司机列表
 */
export default function ShipperList() {
  const [form] = useForm()
  const [shippers, setShippers] = useState<Shipper.ShipperInfo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getShippers()
  }, [])

  async function getShippers() {
    setLoading(true)
    const res = await api.shipper.getShipperList(form.getFieldsValue())
    setShippers(res?.list || [])
    setTimeout(() => setLoading(false), 200)
  }

  // 数据列：司机名称	司机信息	司机状态	车辆信息	昨日在线时长	昨日司机流水	司机评分	行为分	昨日推单数	昨日完单数	加入时间
  const columns: TableColumnsType<Shipper.ShipperInfo> = [
    { title: '司机名称', key: 'driverName', dataIndex: 'driverName', width: 100, fixed: true },
    {
      title: '司机信息',
      key: 'driverInfo',
      dataIndex: 'driverName',
      width: 220,
      render: (_, record) => (
        <p>
          <span>司机ID：{record.driverId}</span>
          <br />
          <span>手机号码：{record.driverPhone}</span> <br />
          <span>注册城市：{record.cityName}</span> <br />
          <span>会员等级：{record.grade}</span> <br />
          <span>司机等级：{record.driverLevel}</span>
        </p>
      ),
    },
    {
      title: '司机状态',
      key: 'accountStatus',
      dataIndex: 'accountStatus',
      width: 100,
      render: (status: Shipper.Status) => {
        switch (status) {
          case Shipper.Status.auth:
            return '待认证'
          case Shipper.Status.normal:
            return '正常'
          case Shipper.Status.temp:
            return '暂时拉黑'
          case Shipper.Status.always:
            return '永久拉黑'
          case Shipper.Status.stop:
            return '停止推送'
          default:
            return '-'
        }
      },
    },
    {
      title: '车辆信息',
      key: 'carInfo',
      dataIndex: 'carNo',
      width: 250,
      render: (_, record) => (
        <p>
          <span>车牌号码: {record.carNo}</span>
          <br />
          <span>车辆品牌: {record.vehicleBrand}</span>
          <br />
          <span>车辆名称: {record.vehicleName}</span>
        </p>
      ),
    },
    { title: '昨日在线时长', key: 'onlineTime', dataIndex: 'onlineTime', width: 130 },
    {
      title: '昨日司机流水',
      key: 'driverAmount',
      dataIndex: 'driverAmount',
      width: 130,
      render: _text => `${formatMoneyCNY(_text)} 元`,
    },
    { title: '司机评分', key: 'rating', dataIndex: 'rating', width: 100 },
    { title: '行为分', key: 'driverScore', dataIndex: 'driverScore', width: 100 },
    { title: '昨日推单数', key: 'pushOrderCount', dataIndex: 'pushOrderCount', width: 130 },
    { title: '昨日完单数', key: 'orderCompleteCount', dataIndex: 'orderCompleteCount', width: 130 },
    { title: '注册时间', key: 'createTime', dataIndex: 'createTime', render: _text => formatDateToLocalString(_text) },
  ]

  function onSearch() {
    getShippers()
  }

  function handleReset() {
    form.resetFields()
    getShippers()
  }

  return (
    <div className={`${styles.shipperList} sidebar-submenu`}>
      <Form
        className={'search-box'}
        layout={'inline'}
        form={form}
        initialValues={{
          accountStatus: null,
        }}
      >
        <Form.Item name={'driverName'} label={'司机名称'}>
          <Input placeholder={'请输入司机名称'} />
        </Form.Item>
        <Form.Item name={'accountStatus'} label={'司机状态'}>
          <Select
            placeholder="请选择司机状态"
            style={{ width: 120 }}
            options={[
              { label: '所有', value: null },
              { label: '待认证', value: '0' },
              { label: '正常', value: '1' },
              { label: '暂时拉黑', value: '2' },
              { label: '永久拉黑', value: '3' },
              { label: '停止推送', value: '4' },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button icon={<SearchOutlined />} type={'primary'} onClick={onSearch}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} type={'default'} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className="base-table">
        <div className="header-wrapper">
          <div className="title">部门列表</div>
          <div className="action" />
        </div>
        <Table<Shipper.ShipperInfo>
          scroll={{ x: 'max-content' }}
          bordered
          columns={columns}
          dataSource={shippers}
          loading={loading}
          rowKey={record => record.id}
        />
      </div>
    </div>
  )
}
