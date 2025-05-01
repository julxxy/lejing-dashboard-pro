import { Action, IModalProps, ModalVariables } from '@/types/modal.ts'
import { useEffect, useImperativeHandle, useState } from 'react'
import { Order } from '@/types'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import api from '@/api'
import { message } from '@/context/AntdGlobalProvider.ts'
import { formatDateToDayjs, formatDayjsToDateString } from '@/utils'

/**
 * 订单弹窗
 */
export default function OrderCreateModal({ parentRef, onRefresh }: IModalProps) {
  const [form] = Form.useForm()
  const [modalOpen, setModalOpen] = useState(false)

  const [action, setAction] = useState<Action>('create')
  const [loading, setLoading] = useState(false)

  const [cities, setCities] = useState<Order.CityDict[]>()
  const [vehicles, setVehicles] = useState<Order.VehicleDict[]>()

  // 暴露方法给父组件使用
  useImperativeHandle(parentRef, () => modalController)
  const modalController = {
    // 开启当前组件弹窗
    openModal: (action: Action, data?: Order.OrderDetail) => {
      if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, data)
      setAction(action)
      setModalOpen(true)
      // 确保日期字段正确地转换为 dayjs 对象
      if (data) {
        form.setFieldsValue({
          ...data,
          useTime: formatDateToDayjs(data.useTime),
          endTime: formatDateToDayjs(data.endTime),
        })
      }
    },
    // 关闭当前组件弹窗
    closeModal: () => {
      setLoading(false)
      setModalOpen(false)
      form.resetFields()
    },
  }

  useEffect(() => {
    Promise.all([api.order.getCities(), api.order.getOrderVehicles()])
      .then(([cities, vehicles]) => {
        setCities(cities)
        setVehicles(vehicles)
      })
      .catch(error => {
        log.error('Error fetching data:', error)
      })
  }, [])

  async function handleSubmit() {
    const validateFields = await form.validateFields()
    if (!validateFields) {
      return
    }
    const values = form.getFieldsValue()
    values.useTime = formatDayjsToDateString(values.useTime)
    values.endTime = formatDayjsToDateString(values.endTime)
    setLoading(true)
    if (action === 'create') {
      await api.order.add(values)
      message.success('订单创建成功')
      setLoading(false)
      modalController.closeModal()
      onRefresh()
    }
  }

  return (
    <Modal
      title={'新建订单'}
      width={ModalVariables.width}
      open={modalOpen}
      onOk={handleSubmit}
      okButtonProps={{
        loading,
        icon: <CheckCircleOutlined />,
        disabled: action === 'view',
      }}
      okText={'确定'}
      onCancel={modalController.closeModal}
      cancelButtonProps={{ disabled: loading, icon: <CloseCircleOutlined /> }}
      cancelText={'取消'}
    >
      <Form
        {...ModalVariables.layout}
        form={form}
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="right"
        initialValues={{
          cityName: cities?.[0]?.name || '',
          orderAmount: 0.01,
          userPayAmount: 0.01,
          driverAmount: 0.01,
          payType: 1,
          vehicleName: vehicles?.[0]?.name || '',
          state: 1,
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="cityName" label="城市名称" rules={[{ required: true }]}>
              <Select placeholder="请选择城市名称">
                {cities?.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="vehicleName" label="车型" rules={[{ required: true }]}>
              <Select placeholder="请选择车型">
                {vehicles?.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="userName" label="用户名" rules={[{ required: true }]}>
              <Input placeholder="请输入用户名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="mobile" label="手机号" rules={[{ required: true }]}>
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="startAddress" label="起始地址">
              <Input placeholder="请输入起始地址" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="endAddress" label="结束地址">
              <Input placeholder="请输入结束地址" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="orderAmount" label="下单金额" rules={[{ required: true }]}>
              <InputNumber placeholder="请输入下单金额" min={0.01} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="userPayAmount" label="支付金额" rules={[{ required: true }]}>
              <InputNumber placeholder="请输入支付金额" min={0.01} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="driverName" label="司机名称" rules={[{ required: true }]}>
              <Input placeholder="请输入司机名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="driverAmount" label="司机金额" rules={[{ required: true }]}>
              <InputNumber placeholder="请输入司机金额" min={0.01} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="payType" label="支付方式">
              <Select placeholder="请选择支付方式">
                <Select.Option value={1}>微信</Select.Option>
                <Select.Option value={2}>支付宝</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="state" label="订单状态">
              <Select placeholder="请选择订单状态">
                <Select.Option value={1}>进行中</Select.Option>
                <Select.Option value={2}>已完成</Select.Option>
                <Select.Option value={3}>超时</Select.Option>
                <Select.Option value={4}>取消</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="useTime" label="用车时间">
              <DatePicker
                placeholder="请选择日期"
                style={{ width: '100%' }}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="endTime" label="订单结束时间">
              <DatePicker
                placeholder="请选择日期"
                style={{ width: '100%' }}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button
            style={{ left: 0, bottom: -60 }}
            type={'default'}
            disabled={action === 'view' || loading}
            onClick={() => form.resetFields()}
          >
            重置表单
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
