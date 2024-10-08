import { Button } from 'antd'

export default function UserList() {
  return (
    <>
      <div className="user-list">
        <div className="search-box"></div>
        <div className="base-table">
          <div className="header-wrapper">
            <div className="title">用户列表</div>
            <div className="actions">
              <Button className="btn">添加</Button>
              <Button className="btn">删除</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
