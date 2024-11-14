import styles from '@/components/NavFooter/index.module.less'
import React from 'react'

export const NavFooter: React.FC = () => {
  const links = [
    {
      label: '中国电子口岸加签方案',
      href: 'https://github.com/Weasley-J/chinaport-data-signature',
    },
    {
      label: '乐璟商城（分布式微服务）',
      href: 'https://github.com/Weasley-J/lejing-mall',
    },
    {
      label: '乐璟OPS（React v18.3.x）',
      href: 'https://github.com/Weasley-J/lejing-dashboard-pro',
    },
    {
      label: 'Where to Go（Vue v3.5.x）',
      href: 'https://github.com/Weasley-J/where-to-go',
    },
  ]
  return (
    <div className={styles.footer}>
      <div>
        {links.map(({ label, href }, index) => (
          <span key={href}>
            <a href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
            {index < links.length - 1 && <span className="gutter">|</span>}
          </span>
        ))}
      </div>
      <div>
        <a href="https://github.com/Weasley-J" target="_blank" rel="noreferrer">
          Lejing Dashboard Pro ©{new Date().getFullYear()} Powered by Weasley
        </a>
      </div>
    </div>
  )
}
