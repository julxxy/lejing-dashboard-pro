import styles from '@/views/dashboard/index.module.less'
import React from 'react'
import { Descriptions, DescriptionsProps } from 'antd'
import useZustandStore from '@/store/useZustandStore.ts'
import { log } from '@/common/logger.ts'

const Dashboard: React.FC = () => {
  const { isDarkEnable } = useZustandStore()
  log.info('is_dark_enable: ', isDarkEnable)
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
      children: '离职'
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
      children: '中台架构'
    }
  ]
  const cardData = [
    { title: '货运司机', count: '110 个' },
    { title: '总流水', count: '11000 元' },
    { title: '总单量', count: '110 单' },
    { title: '开通城市', count: '110 个' }
  ]

  return (
    <>
      <div className={styles.dashboardWrapper}>
        <div className={styles.userInfo}>
          <img
            src={'https://img.bugela.com/uploads/2021/09/04/TX10008_02.jpg'}
            className={styles.avatar}
            alt={'avatar'}
          />
          <Descriptions
            title={
              <div>
                欢迎 <span style={{ fontStyle: 'italic' }}>{username}</span>，开心每一天！
              </div>
            }
            items={items}
          />
        </div>
      </div>
      <div className={styles.reportWrapper}>
        {cardData.map(({ title, count }, index) => (
          <div key={index} className={`${styles.card} ${isDarkEnable ? styles.darkCard : styles.lightCard}`}>
            <div className={styles.title}>{title}</div>
            <div className={styles.count}>{count}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Dashboard
