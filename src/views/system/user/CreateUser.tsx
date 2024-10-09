import { Button, Form, Input, Modal, Select, Space } from 'antd'
import log from '@/common/loggerProvider.ts'
import { isDebugEnable } from '@/common/debugProvider.ts'
import { ModalOpenCloseProps } from '@/types/apiTypes.ts'

const { Option } = Select

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

/**
 * 创建用户弹窗
 */
export default function CreateUser({ isOpen, onClose }: ModalOpenCloseProps) {
  const [form] = Form.useForm()
  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' })
        break
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' })
        break
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' })
        break
      default:
    }
  }

  function onFinish(values: any) {
    if (isDebugEnable) log.info('onFinish', values)
  }

  function onReset() {
    form.resetFields()
  }

  function onFill() {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
      userName: '张三',
      userEmail: '123@qq.com',
    })
  }

  function handleOk() {
    if (isDebugEnable) log.info('提交')
    onClose() // 调用父组件的关闭函数
  }

  function handleCancel() {
    if (isDebugEnable) log.info('取消')
    onClose() // 调用父组件的关闭函数
    Modal.destroyAll()
  }

  return (
    <Modal
      title="创建用户"
      width={800}
      open={isOpen}
      okText={'确认'}
      cancelText={'取消'}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ className: 'btn-primary' }} // 设置按钮颜色
      cancelButtonProps={{ className: 'cancel-button' }} // 设置按钮颜色
    >
      {' '}
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} style={{ maxWidth: 600 }}>
        <Form.Item name="userName" label="用户名称" rules={[{ required: false }]}>
          <Input placeholder={'请输入用户名称'} />
        </Form.Item>
        <Form.Item
          name="userEmail"
          label="用户邮箱"
          rules={[
            { required: true, message: '请输入用户邮箱' },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: '请输入有效的邮箱地址',
            },
          ]}
        >
          <Input placeholder={'请输入用户邮箱'} />
        </Form.Item>
        <Form.Item
          name="mobile"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            {
              pattern: /^1[3-9]\d{9}$/, // 这是中国手机号的常规校验规则
              message: '请输入有效的手机号',
            },
          ]}
        >
          <Input type="text" placeholder={'请输入手机号'} />
        </Form.Item>
        {/* todo 弹窗组件 */}
        <Form.Item name="deptId" label="部门" rules={[{ required: false }]}>
          <Input placeholder={'请输入部门'} />
        </Form.Item>
        <Form.Item name="jon" label="岗位" rules={[{ required: false }]}>
          <Input placeholder={'请输入岗位'} />
        </Form.Item>
        <Form.Item name="state" label={'状态'}>
          <Select>
            <Select.Option value={0}>所有</Select.Option>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>离职</Select.Option>
            <Select.Option value={3}>试用期</Select.Option>
          </Select>
          {/* todo 弹窗组件 */}
        </Form.Item>
        <Form.Item name="roleList" label="角色" rules={[{ required: false }]}>
          <Input placeholder={'请输入角色'} />
        </Form.Item>
        <Form.Item name="gender" label="性别" rules={[{ required: false }]}>
          <Select placeholder="Select a option and change input text above" onChange={onGenderChange} allowClear>
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}>
          {({ getFieldValue }) =>
            getFieldValue('gender') === 'other' ? (
              <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
            <Button type="link" htmlType="button" onClick={onFill}>
              填充所有
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
