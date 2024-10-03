import styles from './login.module.less'
import { Button, Form, Input } from 'antd'
import api from '@/api'
import storageUtils from '@/utils/storageUtils.ts'
import { useState } from 'react'
import { useAntdMessage } from '@/utils/AntdHelper.ts'
import { utils } from '@/common/utils.ts'
import { Environment } from '@/types/enums.ts'

export default function LoginFC() {
  const { message } = useAntdMessage()
  const [loading, setLoading] = useState(false)
  const isProduction = Environment.isProduction()
  const onFinish = async (values: any) => {
    setLoading(true)
    const params = { userName: values.username, userPwd: values.password }
    const data: any = await api.login(params)
    setLoading(false)
    if (!utils.hasValue(data, 'data')) {
      message.error('用户名或密码错误')
      return
    }
    message.success('登录成功')
    storageUtils.set('token', data)
    const urlSearchParams = new URLSearchParams(window.location.search)
    location.href = urlSearchParams.get('callback') || '/welcome'
  }

  return (
    <>
      <div className={styles.login}>
        <div className={styles.loginWrapper}>
          <p className={styles.title}>系统登录</p>
          <Form name="basic" onFinish={onFinish} autoComplete="off">
            <Form.Item
              name="username"
              initialValue={'Test'}
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder={isProduction ? '' : '请输入用户名'} />
            </Form.Item>

            <Form.Item
              name="password"
              initialValue={'Test888'}
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
