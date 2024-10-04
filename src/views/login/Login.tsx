import styles from './login.module.less'
import { Button, Form, Input } from 'antd'
import api from '@/api'
import storageUtils from '@/utils/storageUtils.ts'
import { useState } from 'react'
import { useAntdMessage } from '@/utils/AntdHelper.ts'
import { Environment, ResultStatus } from '@/types/enums.ts'
import { isDebugEnable } from '@/common/debugEnable.ts'
import { log } from '@/common/logger.ts'
import { URIs } from '@/router'
import { utils } from '@/common/utils.ts'
import useZustandStore from '@/store/useZustandStore.ts'

export default function LoginFC() {
  const { setToken } = useZustandStore()
  const { message } = useAntdMessage()
  const [loading, setLoading] = useState(false)
  const isProduction = Environment.isProduction()
  const redirectToWelcome = (data: string) => {
    message.success('登录成功').then(() => {})
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
      if (!utils.hasData(data) || (utils.hasKey(data, 'code') && (data.code as string) !== ResultStatus.Success)) {
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
    <>
      <div className={styles.login}>
        <div className={styles.loginWrapper}>
          <p className={styles.title}>系统登录</p>
          <Form name="basic" onFinish={onFinish} autoComplete="off">
            <Form.Item
              name="username"
              initialValue={'JackMa'}
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder={isProduction ? '' : '请输入用户名'} />
            </Form.Item>

            <Form.Item
              name="password"
              initialValue={'123456'}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder={isProduction ? '' : '请输入密码'} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" block={true} htmlType="submit" loading={loading}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}
