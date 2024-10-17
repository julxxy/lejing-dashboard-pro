import { Button, Form, Space } from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'

/**
 * 搜索表单组件
 * @fileOverview This is the SearchForm component.
 */
export default function SearchForm(props: any) {
  return (
    <Form className={'search-box'} layout={'inline'} form={props.form} initialValues={props.initialValues}>
      {props.children}
      <Form.Item>
        <Space>
          <Button icon={<SearchOutlined />} type={'primary'} onClick={props.submit}>
            搜索
          </Button>
          <Button icon={<ReloadOutlined />} type={'default'} onClick={props.reset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
