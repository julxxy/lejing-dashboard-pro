import { Button, Form, Input, Modal, Select, TreeSelect, Upload, UploadProps } from 'antd'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { useImperativeHandle, useState } from 'react'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
import { message } from '@/context/AntdGlobalProvider.ts'
import apiClient from '@/api/apiClient.ts'
import { ResultStatus } from '@/types/enum.ts'
import { Action, IModalProps, ModalVariables } from '@/types/modal.ts'
import { Department, Role, User } from '@/types'
import api from '@/api'

/**
 * 创建/编辑用户弹窗
 */
export default function UserModal({ parentRef, onRefresh }: IModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [modalOpen, setModalOpen] = useState(false)
  const [action, setAction] = useState<Action>('create')
  const [deptList, setDeptList] = useState<Department.Item[]>()
  const [roleList, setRoleList] = useState<Role.RoleDetail[]>([])

  // 开启当前组件的弹窗显示
  const openModal = (action: Action, data?: User.UserItem) => {
    if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, JSON.stringify(data))
    if (action === 'edit' && data) {
      form.setFieldsValue(data)
      setImageUrl(data.userImg)
    }
    fetchDeptList()
    fetchRoleList()
    setModalOpen(true)
    setAction(action)
  }
  // 关闭当前组件的弹窗显示
  const closeModal = () => {
    setModalOpen(false)
    setImageUrl(undefined)
    handleReset()
  }
  useImperativeHandle(parentRef, () => ({ openModal, closeModal })) // 暴露方法给父组件使用

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
      } else if (action === 'edit') {
        res = await api.user.editUser(args)
      }
      if (isDebugEnable) log.info('提交结果', res)
      if (res?.code === ResultStatus.Failed) {
        message.error(res?.msg)
        return
      }
      message.success('操作成功')
      onRefresh() // 调用父组件的刷新函数
      closeModal() // 调用父组件的关闭函数
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    if (isDebugEnable) log.info('取消')
    closeModal() // 调用父组件的关闭函数
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

  const fetchDeptList = async () => {
    const deptList = await api.dept.getDepartments({})
    setDeptList(deptList)
  }

  const fetchRoleList = async () => {
    const data = await api.role.getAll()
    setRoleList(data)
  }

  return (
    <Modal
      title={action === 'create' ? '创建用户' : '编辑用户'}
      width={ModalVariables.width}
      open={modalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" icon={<CloseCircleOutlined />} onClick={handleCancel}>
          取消
        </Button>,
        <Button key="reset" icon={<ReloadOutlined />} onClick={handleReset} disabled={action !== 'create'}>
          重置
        </Button>,
        <Button key="submit" icon={<CheckCircleOutlined />} type="primary" onClick={handleSubmit}>
          提交
        </Button>,
      ]}
    >
      <Form
        {...ModalVariables.layout}
        style={{ maxWidth: 600 }}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        initialValues={{ state: 1 }}
      >
        <Form.Item name="userId" label="用户ID" hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item
          name="userName"
          label="用户名称"
          rules={[{ required: false }, { min: 5, max: 20, message: '用户名长度必须在5到12个字符之间' }]}
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
        <Form.Item name="deptId" label="部门" rules={[{ required: true, message: '请选择部门' }]}>
          <TreeSelect
            placeholder={'请选择部门'}
            allowClear
            loading={deptList === undefined}
            treeDefaultExpandAll
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            fieldNames={{ label: 'deptName', value: '_id' }}
            treeData={deptList}
          />
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
        <Form.Item name="roleList" label="角色" rules={[{ required: false, message: '请选择角色' }]}>
          <Select mode="multiple">
            {roleList?.map(({ _id, roleName }) => (
              <Select.Option value={_id} key={_id}>
                {roleName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="用户头像">
          <Upload
            name="file"
            showUploadList={false}
            listType="picture-circle"
            className="avatar-uploader"
            action="/api/users/upload"
            headers={{ ...apiClient.generateAuthHeaders() }}
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
