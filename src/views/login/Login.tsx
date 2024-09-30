import styles from './login.module.less'
import { Button, Form, Input, message } from 'antd'
import { log } from '@/common/logger.ts'
import api from '@/api'
import storage from '@/utils/storage.ts'

export default function LoginFC() {
  const isProduction = import.meta.env.MODE === 'production'
  const onFinish = async (values: any) => {
    const params = { userName: values.username, userPwd: values.password }
    const data = await api.login(params) as unknown as string
    if (data === '') {
      message.error('登录失败，token为空')
      log.error('Login failed:', params)
      return
    }
    storage.set('token', data)
    message.success('登录成功')
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
              <Button type="primary" block={true} htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}
