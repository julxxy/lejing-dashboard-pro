import styles from '@/views/login/Login.module.less'
import { Button, Form, Input } from 'antd'
import api from '@/api'
import storageUtils from '@/utils/storageUtils.ts'
import { useRef, useState } from 'react'
import { useAntd } from '@/context/AntdGlobalProvider.ts'
import { Environment, ResultStatus } from '@/types/appEnums.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { URIs } from '@/router'
import { objectUtils } from '@/common/objectUtils.ts'
import useZustandStore from '@/store/useZustandStore.ts'
import { isTrue } from '@/common/booleanUtils.ts'
import { base64Utils } from '@/common/base64Utils.ts'
import Draggable from 'react-draggable'
import { LoginOutlined } from '@ant-design/icons'

function getAccount(): { username: string; password: string } {
  let account = { username: '', password: '' }
  if (Environment.isProduction()) {
    return account
  }
  let admin = import.meta.env.VITE_ACCOUNT_ADMIN as string
  let readonly = import.meta.env.VITE_ACCOUNT_READONLY as string
  admin = base64Utils.isBase64(admin) ? base64Utils.decodeBase64(admin) : admin
  readonly = base64Utils.isBase64(readonly) ? base64Utils.decodeBase64(readonly) : readonly
  if (isTrue(import.meta.env.VITE_USE_ADMIN_ACCOUNT)) {
    const { name, pwd } = JSON.parse(admin)
    account = { username: name, password: pwd }
  } else {
    const { name, pwd } = JSON.parse(readonly)
    account = { username: name, password: pwd }
  }
  return account
}

export default function LoginFC() {
  const { setToken } = useZustandStore()
  const { message } = useAntd()
  const [loading, setLoading] = useState(false)
  const { username, password } = getAccount()
  const loginWrapperRef = useRef<HTMLDivElement>(null) // 创建 ref
  const isDragEnable = true
  const redirectToWelcome = (data: string) => {
    message.success('登录成功')
    storageUtils.set('token', data)
    setToken(data)
    setTimeout(() => {
      const urlSearchParams = new URLSearchParams(window.location.search)
      location.href = urlSearchParams.get('callback') || URIs.welcome
    }, 1000)
  }
  const onFinish = async (values: any) => {
    setLoading(true)
    const params = { userName: values.username, userPwd: values.password }
    try {
      const data: any = await api.login(params)
      if (!objectUtils.hasData(data) || (objectUtils.hasKey(data, 'code') && data.code !== ResultStatus.Success)) {
        if (isDebugEnable) log.error('login failed: ', data)
        message.error('用户名或密码错误')
        return
      }
      redirectToWelcome(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.login}>
      <Draggable nodeRef={loginWrapperRef} bounds="parent" handle=".drag-handle" disabled={!isDragEnable}>
        <div
          ref={loginWrapperRef}
          className={`${styles.loginWrapper}`}
          style={isDragEnable ? { right: '12%' } : { left: '50%' }}
        >
          <p className={`${styles.title} drag-handle`}>系统登录</p>
          <Form name="basic" onFinish={onFinish} autoComplete="off">
            <Form.Item
              name="username"
              initialValue={username}
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder={'请输入用户名'} style={{ height: '40px', fontSize: '16px' }} />
            </Form.Item>

            <Form.Item
              name="password"
              initialValue={password}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder={'请输入密码'} style={{ height: '40px', fontSize: '16px' }} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                block={true}
                htmlType="submit"
                loading={loading}
                icon={<LoginOutlined />}
                style={{ height: '40px', fontSize: '16px' }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Draggable>
    </div>
  )
}
