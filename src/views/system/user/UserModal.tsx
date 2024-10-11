import { Button, Form, Input, Modal, Select, Upload, UploadProps } from 'antd'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { useImperativeHandle, useState } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
import { message } from '@/context/AntdGlobalProvider.ts'
import requestUtils from '@/utils/httpUtils.ts'
import { ResultStatus } from '@/types/Enums.ts'
import { Action, IModalProps, ModalVariables } from '@/types/modal.ts'
import { User } from '@/types/ApiTypes.ts'
import api from '@/api'

/**
 * 创建/编辑用户弹窗
 */
export default function UserModal({ currentRef, onRefresh }: IModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [modalOpen, setModalOpen] = useState(false)
  const [action, setAction] = useState<Action>('create')

  // 开启当前组件的弹窗显示
  const openModal = (action: Action, data?: User.UserItem) => {
    if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, JSON.stringify(data))
    if (action === 'edit' && data) {
      form.setFieldsValue(data)
      setImageUrl(data.userImg)
    }
    setModalOpen(true)
    setAction(action)
  }
  // 关闭当前组件的弹窗显示
  const closeModal = () => {
    setModalOpen(false)
    setImageUrl(undefined)
    handleReset()
  }
  useImperativeHandle(currentRef, () => ({ openModal, closeModal })) // 暴露方法给父组件使用

  function onFinish(values: any) {
    if (isDebugEnable) log.info('on_finish: ', values)
  }

  function handleReset() {
    form.resetFields()
  }

  async function handleSubmit() {
    const data = await form.validateFields()
    if (!data) message.error('表单字段为空')
    const args = {
      ...data,
      userImg: imageUrl,
    }

    try {
      let res = null
      if (action === 'create') {
        res = await api.user.addUser(args)
      }
      if (action === 'edit') {
        res = await api.user.editUser(args)
      }
      if (isDebugEnable) log.info('提交结果', res)
      onRefresh() // 调用父组件的刷新函数
      currentRef?.current.closeModal() // 调用父组件的关闭函数
    } finally {
      message.success('操作成功')
      setLoading(false)
    }
  }

  function handleCancel() {
    if (isDebugEnable) log.info('取消')
    currentRef?.current?.closeModal() // 调用父组件的关闭函数
  }

  const handleChange: UploadProps['onChange'] = info => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      const { code, msg, data } = info.file.response
      if (isDebugEnable) log.info('图片上传', info.file.response)
      setLoading(false)
      if (ResultStatus.Success !== code) {
        message.error(msg)
        return
      }
      message.success('上传成功')
      const { file } = data
      setImageUrl(file)
    } else if (info.file.status === 'error') {
      message.error('服务器错误，稍后再试。')
    }
  }

  // 文件上传前置校验
  function beforeUpload(file: RcFile) {
    const isSupportedFormat = /\.(jpe?g|png|gif|bmp|webp)$/i.test(file.name)
    if (!isSupportedFormat) {
      message.error('您只能上传 JPG/PNG/GIF/BMP/WEBP 文件！')
      setLoading(false)
      return false
    }
    const isLt = file.size / 1024 / 1024 < 0.5
    if (!isLt) {
      message.error('图片必须小于 500KB！')
      setLoading(false)
      return false
    }
    return true
  }

  return (
    <Modal
      title={action === 'create' ? '创建用户' : '编辑用户'}
      width={ModalVariables.width}
      open={modalOpen}
      okText={'确认'}
      cancelText={'取消'}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okButtonProps={{ className: 'btn-primary' }} // 设置按钮颜色
      cancelButtonProps={{ className: 'cancel-button' }} // 设置按钮颜色
      footer={[
        <Button key="reset" type={'dashed'} onClick={handleReset} disabled={action !== 'create'}>
          重置
        </Button>,
        <Button key="cancel" onClick={handleCancel} className={'cancel-button'}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} className={'cta-button'}>
          提交
        </Button>,
      ]}
    >
      <Form {...ModalVariables.layout} style={{ maxWidth: 600 }} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="userId" label="用户ID" hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item
          name="userName"
          label="用户名称"
          rules={[{ required: false }, { min: 5, max: 12, message: '用户名长度必须在5到12个字符之间' }]}
        >
          <Input placeholder={'请输入用户名称'} />
        </Form.Item>
        <Form.Item
          name="userEmail"
          label="用户邮箱"
          rules={[
            { required: true, message: '请输入用户邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: '请输入有效的邮箱地址',
            },
          ]}
        >
          <Input placeholder={'请输入用户邮箱'} disabled={action === 'edit'} />
        </Form.Item>
        <Form.Item
          name="mobile"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            { len: 11, message: '请输入11位手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
          ]}
        >
          <Input type="text" placeholder={'请输入手机号'} />
        </Form.Item>
        <Form.Item name="deptId" label="部门" rules={[{ required: false }]}>
          <Input placeholder={'请输入部门'} />
        </Form.Item>
        <Form.Item name="job" label="岗位" rules={[{ required: false }]}>
          <Input placeholder={'请输入岗位'} />
        </Form.Item>
        <Form.Item name="state" label={'状态'}>
          <Select>
            <Select.Option value={0}>所有</Select.Option>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>离职</Select.Option>
            <Select.Option value={3}>试用期</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="roleList" label="角色" rules={[{ required: false }]}>
          <Input placeholder={'请输入角色'} />
        </Form.Item>
        <Form.Item label="用户头像">
          <Upload
            name="file"
            showUploadList={false}
            listType="picture-circle"
            className="avatar-uploader"
            action="/api/users/upload"
            headers={{ ...requestUtils.getAuthHeaders() }}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%', borderRadius: '100%' }} />
            ) : (
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}
