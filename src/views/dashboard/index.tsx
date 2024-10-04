import styles from '@/views/dashboard/index.module.less'
import React from 'react'
import { Descriptions, DescriptionsProps } from 'antd'

const Dashboard: React.FC = () => {
  const username = 'Weasley'
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '用户 ID',
      children: `${username}`
    },
    {
      key: '2',
      label: '邮箱',
      children: 'weasley2023@outlook.com'
    },
    {
      key: '3',
      label: '状态',
      children: '在职'
    },
    {
      key: '4',
      label: '手机号',
      children: '181****2681'
    },
    {
      key: '5',
      label: '职位',
      children: '高级架构师'
    },
    {
      key: '6',
      label: '部门',
      children: '架构组'
    }
  ]

  return (
    <>
      <div className={styles.dashboardWrapper}>
        <div className={styles.userInfo}>
          <img
            src={'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'}
            className={styles.avatar}
            alt={'avatar'}
          />
          <Descriptions title={`欢迎新 ${username}，开心每一天！`} items={items} />
        </div>
      </div>
      <div className={styles.reportWrapper}>
        <div className={styles.card}>
          <div className={styles.title}>司机数量</div>
          <div className={styles.count}>110 个</div>
        </div>
        <div className={styles.card}>
          <div className={styles.title}>总流水</div>
          <div className={styles.count}>11000 元</div>
        </div>
        <div className={styles.card}>
          <div className={styles.title}>总订单</div>
          <div className={styles.count}>110 单</div>
        </div>
        <div className={styles.card}>
          <div className={styles.title}>开通城市</div>
          <div className={styles.count}>110 个</div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
