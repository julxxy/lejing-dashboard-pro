import styles from '@/views/welcome/index.module.less'

const Welcome = () => {
  return (
    <>
      <div className={styles.welcome}>
        <div className={styles.content}>
          <div className={styles.greeting}>欢迎使用</div>
          <div className={styles.title}>
            <span style={{ display: 'none' }}>React 通用后台管理系统： </span>乐璟电商运营后台专业版
          </div>
          <div className={styles.desc}>
            <span style={{ fontSize: 18 }}>技术栈：</span>
            <span style={{ wordBreak: 'break-word', wordSpacing: 'normal' }}>
              React v18.3, ReactRouter v6.26.x, Zustand v5.0.x, AntD v5.21.x, TypeScript v5.5.x, Vite v5.4.x
            </span>
          </div>
        </div>
        <div className={styles.backgroundImage}></div>
      </div>
    </>
  )
}

export default Welcome
